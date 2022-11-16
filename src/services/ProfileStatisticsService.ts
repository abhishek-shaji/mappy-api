import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { differenceInSeconds } from 'date-fns';

import { ProfileStatistics, ProfileStatisticsDocument } from '../models/ProfileStatistics';
import { UserService } from './UserService';
import { AbstractCRUDService } from './AbstractCRUDService';
import { Exchanges } from '../enum/Exchanges';
import { RoutingKeys } from '../enum/RoutingKeys';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HaversineService } from './HaversineService';
import { GeoLocationDocument } from '../models/GeoLocation';
import { Profile, ProfileDocument } from '../models/Profile';
import { GeoTrackingSessionDocument } from '../models/GeoTrackingSession';
import { Length, Weight } from '../enum/Units';
import { Gender } from '../enum/Gender';
import { formatProfileStatistics } from '../formatters/formatProfileStatistics';
import { Region } from '../models/Region';
import { Country } from '../models/Country';
import { RegionAndCountryService } from './RegionAndCountryService';

@Injectable()
export class ProfileStatisticsService extends AbstractCRUDService {
  constructor(
    @InjectModel(ProfileStatistics.name) private readonly profileStatisticsModel: Model<ProfileStatistics>,
    @InjectModel(Region.name) private readonly cityModel: Model<Region>,
    @InjectModel(Country.name) private readonly countryModel: Model<Country>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private readonly amqpConnection: AmqpConnection,
    private readonly haversineService: HaversineService,
    private readonly regionAndCountryService: RegionAndCountryService,
  ) {
    super(profileStatisticsModel, formatProfileStatistics);
  }

  resetDailyProfileStats = async () => {
    await this.profileStatisticsModel.updateMany({}, { caloriesBurnedToday: 0, distanceTravelledToday: 0 });
  };

  createProfileStatistics = async () => {
    const profileStatistics = new this.profileStatisticsModel({
      caloriesBurned: 0,
      distanceTravelled: 0,
      currentStreak: 0,
      maxStreak: 0,
      countriesVisited: 0,
      regionsVisited: 0,
      caloriesBurnedToday: 0,
      distanceTravelledToday: 0,
    });
    await profileStatistics.save();

    return profileStatistics;
  };

  updateProfileStatistics = async (
    accountId: string,
    trackingSessionId: string,
    profile: ProfileDocument,
    statistics: ProfileStatisticsDocument,
  ) => {
    const geoTrackingData = await this.fetchGeoTracking(trackingSessionId);
    this.updateDistanceTravelled(statistics, geoTrackingData.locationHistory);
    this.updateCaloriesBurned(profile, statistics, geoTrackingData);
    await this.regionAndCountryService.updateCityAndCountries(profile, geoTrackingData.locationHistory, statistics);
    await this.updateStreak(accountId, statistics);

    await statistics.save();
    await profile.save();
  };

  private isTrackingSessionStreak = async (accountId: string): Promise<boolean> => {
    return await this.amqpConnection.request<any>({
      exchange: Exchanges.GeoTracking,
      routingKey: RoutingKeys.IsTrackingSessionStreak,
      payload: {
        accountId,
      },
    });
  };

  private fetchGeoTracking = async (trackingSessionId: string) => {
    return await this.amqpConnection.request<any>({
      exchange: Exchanges.GeoTracking,
      routingKey: RoutingKeys.GetGeoTrackingSession,
      payload: {
        trackingSessionId,
      },
    });
  };

  private calculateBMR = ({ weight, height, gender }: Profile) => {
    const weightInKg = weight.unit === Weight.kg ? parseFloat(weight.value) : parseFloat(weight.value) * 0.453592;
    const heightInCm = height.unit === Length.cm ? parseFloat(height.value) : parseFloat(weight.value) * 30.48;

    switch (gender) {
      case Gender.male:
        return 13.75 * weightInKg + 5 * heightInCm - 6.76 * 20 + 66;
      default:
        return 9.56 * weightInKg + 1.85 * heightInCm - 4.68 * 20 + 655;
    }
  };

  private calculateBurnedCalories = (profile: ProfileDocument, { startTime, endTime }: GeoTrackingSessionDocument) => {
    const bmr = this.calculateBMR(profile);
    const activityDurationInHrs = differenceInSeconds(new Date(endTime), new Date(startTime)) / (60 * 60);

    return Math.abs((bmr / 24) * 2.9 * activityDurationInHrs);
  };

  private updateCaloriesBurned = (
    profile: ProfileDocument,
    statistics: ProfileStatisticsDocument,
    geoTrackingSession: GeoTrackingSessionDocument,
  ) => {
    const caloriesBurned = this.calculateBurnedCalories(profile, geoTrackingSession);
    statistics.caloriesBurned = Math.round(Math.abs(statistics.caloriesBurned) + caloriesBurned);
    statistics.caloriesBurnedToday = Math.round(Math.abs(statistics.caloriesBurnedToday) + caloriesBurned);

    return statistics.caloriesBurned;
  };

  private updateDistanceTravelled = (statistics: ProfileStatisticsDocument, locationHistory: GeoLocationDocument[]) => {
    statistics.distanceTravelled += this.haversineService.calculateDistanceTravelled(locationHistory);
    statistics.distanceTravelledToday += this.haversineService.calculateDistanceTravelled(locationHistory);

    return statistics.distanceTravelled;
  };

  private updateStreak = async (accountId: string, statistics: ProfileStatisticsDocument) => {
    const { isStreak, shouldIncrement }: any = await this.isTrackingSessionStreak(accountId);
    if (isStreak && shouldIncrement) {
      statistics.currentStreak += 1;
      statistics.maxStreak < statistics.currentStreak ? (statistics.maxStreak = statistics.currentStreak) : null;
      return statistics.currentStreak;
    }

    if (!shouldIncrement) {
      return statistics.currentStreak;
    }

    statistics.currentStreak = 1;
    return 1;
  };
}
