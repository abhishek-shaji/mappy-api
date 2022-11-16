import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GeoTrackingSession, GeoTrackingSessionDocument } from '../models/GeoTrackingSession';
import { UserDocument } from '../models/User';
import { GeoLocationService } from './GeoLocationService';
import { MapboxService } from './MapboxService';
import { HaversineService } from './HaversineService';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Exchanges } from '../enum/Exchanges';
import { RoutingKeys } from '../enum/RoutingKeys';
import { formatGeoTrackingSession } from '../formatters/formatGeoTrackingSession';
import { differenceInCalendarDays } from 'date-fns';
import { AbstractCRUDService } from './AbstractCRUDService';

@Injectable()
export class GeoTrackingSessionService extends AbstractCRUDService {
  constructor(
    @InjectModel(GeoTrackingSession.name) private readonly geoTrackingSessionModel: Model<GeoTrackingSession>,
    private readonly geoLocationService: GeoLocationService,
    private readonly mapboxService: MapboxService,
    private readonly haversineService: HaversineService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super(geoTrackingSessionModel, () => null);
  }

  verifySessionValidity = async (sessionId: string) => {
    const session = await this.geoTrackingSessionModel.findById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.endTime) {
      console.log('Session expired');
      throw new ConflictException('Session expired');
    }
  };

  findActiveSession = async (user: UserDocument): Promise<any> => {
    const session = await this.geoTrackingSessionModel.findOne({
      user: user._id,
      endTime: undefined,
    });

    if (!session) {
      return null;
    }

    const { _id, startTime, endTime, createdAt, updatedAt }: any = session;

    const location = await this.geoLocationService.findBySessionId(session);

    return {
      id: _id,
      startTime,
      endTime,
      createdAt,
      updatedAt,
      locationHistory: location || [],
    };
  };

  isTrackingSessionStreak = async (accountId: string) => {
    // @ts-ignore
    const sessions = await this.geoTrackingSessionModel.find({ user: accountId }).sort({ startTime: 'desc' }).limit(2);
    if (sessions.length === 1) {
      return { isStreak: true, shouldIncrement: true };
    }

    const differenceInDays = differenceInCalendarDays(new Date(sessions[0].startTime), new Date(sessions[1].startTime));

    return { isStreak: differenceInDays <= 1, shouldIncrement: differenceInDays === 1 };
  };

  initiateTrackingSession = async (user: UserDocument): Promise<GeoTrackingSessionDocument> => {
    const activeSession = await this.findActiveSession(user);
    if (activeSession) {
      throw new ConflictException('An active session already exist!');
    }

    const geoTrackingSession = new this.geoTrackingSessionModel({
      startTime: new Date(),
      user: user._id,
    });

    await geoTrackingSession.save();

    return geoTrackingSession;
  };

  terminateActiveTrackingSession = async (user: UserDocument): Promise<any> => {
    const geoTrackingSession = await this.findActiveSession(user);

    if (!geoTrackingSession) {
      throw new ConflictException('No active geo tracking session found');
    }

    const updatedSession: any = await this.geoTrackingSessionModel
      .findOneAndUpdate(
        { _id: geoTrackingSession.id },
        {
          $set: { endTime: new Date() },
        },
        { new: true },
      )
      .exec();

    const locationHistory = await this.geoLocationService.getLocationHistory(geoTrackingSession.id);
    const distanceTravelled = await this.haversineService.calculateDistanceTravelled(locationHistory);

    await this.amqpConnection.publish(
      Exchanges.GeoTracking,
      RoutingKeys.GeoTrackingSessionTerminated,
      {
        trackingSessionId: updatedSession._id,
        statistics: { distanceTravelled },
      },
      { headers: { 'x-account-id': String(user._id) } },
    );

    return formatGeoTrackingSession(updatedSession);
  };
}
