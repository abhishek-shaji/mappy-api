import { Injectable } from '@nestjs/common';
import { GeoLocationDocument } from '../models/GeoLocation';
import { CoordinateLongitudeLatitude } from 'haversine';
import { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding';
const mbxClient = require('@mapbox/mapbox-sdk');
const directionsClient = require('@mapbox/mapbox-sdk/services/directions');
const geocodingClient = require('@mapbox/mapbox-sdk/services/geocoding');

@Injectable()
export class MapboxService {
  private directionsClient: any;
  private baseClient: any;
  private geocodingClient: GeocodeService;

  constructor() {
    this.baseClient = mbxClient({ accessToken: process.env.MAPBOX_API_KEY });
    this.directionsClient = directionsClient({ accessToken: process.env.MAPBOX_API_KEY });
    this.geocodingClient = geocodingClient({ accessToken: process.env.MAPBOX_API_KEY });
  }

  private formatLocationToWayPoints = (locations: GeoLocationDocument[]) =>
    locations.map(({ latitude, longitude }: GeoLocationDocument) => ({
      coordinates: [longitude, latitude],
    }));

  private extractDistanceFromResult = (result: any) => result.body.routes[0].distance;

  calculateDistanceTravelled = async (locationHistory: GeoLocationDocument[]) => {
    const waypoints = this.formatLocationToWayPoints(locationHistory);
    const result = await this.directionsClient
      .getDirections({
        profile: 'walking',
        waypoints,
      })
      .send();

    return this.extractDistanceFromResult(result);
  };

  private findCountryFromContext = (ctx: any) => {
    const item = ctx.find((item) => item['id'] && item['id'].includes('country'));

    if (item) {
      return {
        code: item['short_code'],
        text: item['text'],
      };
    }
  };

  private findCityFromContext = (ctx: any) => {
    const item = ctx.find((item) => item['id'] && item['id'].includes('region'));

    if (item) {
      return {
        code: item['short_code'],
        text: item['text'],
      };
    }
  };

  getLocationRegionAndCountry = async ({ longitude, latitude }: CoordinateLongitudeLatitude) => {
    const response = await this.geocodingClient
      .reverseGeocode({
        query: [longitude, latitude],
        mode: 'mapbox.places',
      })
      .send();

    console.log(response.body.features[0].context);

    const country = this.findCountryFromContext(response.body.features[0].context);
    const region = this.findCityFromContext(response.body.features[0].context);

    return {
      country,
      region,
    };
  };
}
