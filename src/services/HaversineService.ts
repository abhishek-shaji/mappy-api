import { Injectable } from '@nestjs/common';
import { GeoLocationDocument } from '../models/GeoLocation';

const haversine = require('haversine');

@Injectable()
export class HaversineService {
  calculateDistanceTravelled = (locationHistory: GeoLocationDocument[]) =>
    locationHistory.reduce((total, { latitude, longitude }: GeoLocationDocument, index: number) => {
      const nextGeoLocation = locationHistory[index + 1];

      if (nextGeoLocation) {
        return (
          total +
          haversine(
            { latitude, longitude },
            { latitude: nextGeoLocation.latitude, longitude: nextGeoLocation.longitude },
            { unit: 'meter' },
          )
        );
      }

      return total;
    }, 0);
}
