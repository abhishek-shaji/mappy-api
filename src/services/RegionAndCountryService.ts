import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Country } from '../models/Country';
import { Region } from '../models/Region';
import { ProfileDocument } from '../models/Profile';
import { GeoLocationDocument } from '../models/GeoLocation';
import { MapboxService } from './MapboxService';
import { ProfileStatisticsDocument } from '../models/ProfileStatistics';

@Injectable()
export class RegionAndCountryService {
  constructor(
    @InjectModel(Country.name) private readonly countryModel: Model<Country>,
    @InjectModel(Region.name) private readonly regionModel: Model<Region>,
    private readonly mapboxService: MapboxService,
  ) {}

  private pushUniqueItemsToArray = (items: any, item) => {
    if (!items) {
      return [item];
    }

    return [...new Set(JSON.parse(JSON.stringify([...items, item])))];
  };

  addRegionToProfile = async (profile: ProfileDocument, { code, text }: any) => {
    const regionFromDb = await this.regionModel.findOne({ code });
    if (!regionFromDb) {
      const region = new this.regionModel({ code, name: text });
      await region.save();

      profile.regions = this.pushUniqueItemsToArray(profile.regions, region._id);

      return region;
    }

    profile.regions = this.pushUniqueItemsToArray(profile.regions, regionFromDb._id);
    return regionFromDb;
  };

  addCountryToProfile = async (profile: ProfileDocument, { code, text }: any) => {
    const countryFromDb = await this.countryModel.findOne({ code });
    if (!countryFromDb) {
      const country = new this.countryModel({ code, name: text });
      await country.save();

      profile.countries = this.pushUniqueItemsToArray(profile.countries, country._id);

      return country;
    }

    profile.countries = this.pushUniqueItemsToArray(profile.countries, countryFromDb._id);
    return countryFromDb;
  };

  public updateCityAndCountries = async (
    profile: ProfileDocument,
    locationHistory: GeoLocationDocument[],
    statistics: ProfileStatisticsDocument,
  ) => {
    if (!locationHistory.length) {
      console.info('No locations found. Skipping..');
      return;
    }

    const { country, region } = await this.mapboxService.getLocationRegionAndCountry({
      longitude: locationHistory[0].longitude,
      latitude: locationHistory[0].latitude,
    });

    if (country) {
      await this.addCountryToProfile(profile, country);
    }

    if (region) {
      await this.addRegionToProfile(profile, region);
    }

    statistics.countriesVisited = profile.countries.length;
    statistics.regionsVisited = profile.regions.length;
  };
}
