import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GeoLocation, GeoLocationDocument } from '../models/GeoLocation';
import { GeoTrackingSessionDocument } from '../models/GeoTrackingSession';
import { GeoLocationPoint } from '../models/GeoLocationPoint';
import { Region } from '../types/geolocation';
import { formatCoordinatesToHeatMap } from '../formatters/formatCoordinatesToHeatMap';
import { getBoundsByRegion } from 'src/utils/getBoundsByRegion';

@Injectable()
export class GeoLocationService {
  constructor(
    @InjectModel(GeoLocation.name) private readonly geoLocationModel: Model<GeoLocation>,
    @InjectModel(GeoLocationPoint.name) private readonly geoLocationPointModel: Model<GeoLocationPoint>,
  ) {}

  getLocationHistory = async (session: GeoTrackingSessionDocument) =>
    this.geoLocationModel
      .find({
        session,
      })
      .select('latitude longitude -_id');

  findBySessionId = async (session: GeoTrackingSessionDocument) =>
    this.geoLocationModel.find({
      session,
    });

  addGeoLocationToSession = async (sessionId: string, data: any, accountId: string): Promise<GeoLocationDocument> => {
    const geoLocation = new this.geoLocationModel({
      ...data,
      accountId,
      point: {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      },
      session: sessionId,
    });
    await geoLocation.save();

    console.info('GeoLocation saved');
    return geoLocation;
  };

  getHeatMapCoordinatesByRegion = async (region: Region, accountId: string) => {
    const bounds = getBoundsByRegion(region);
    const locationCoordinates = await this.geoLocationModel
      .find({
        point: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [bounds],
            },
          },
        },
        accountId,
      })
      .select('latitude longitude session -_id');

    console.log(`Found ${locationCoordinates.length} heatmap points for accountId: ${accountId}`);

    return formatCoordinatesToHeatMap(locationCoordinates);
  };
}
