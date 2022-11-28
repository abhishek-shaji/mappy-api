import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

import { GeoLocationService } from '../services/GeoLocationService';
import { formatGeoTrackingSession } from '../formatters/formatGeoTrackingSession';
import { GeoTrackingSessionService } from '../services/GeoTrackingSessionService';
import { EXCHANGES } from '../constants/exchanges';
import { QUEUES } from '../constants/queues';
import { ROUTING_KEYS } from '../constants/routingKeys';

@Injectable()
class GeoTrackingSessionHandler {
  constructor(
    private readonly geoLocationService: GeoLocationService,
    private readonly geoTrackingSessionService: GeoTrackingSessionService,
  ) {}

  @RabbitRPC({
    exchange: EXCHANGES.PROFILE,
    routingKey: ROUTING_KEYS.GET_GEO_TRACKING_SESSION,
    queue: QUEUES.GET_GEO_LOCATION_TRACKING,
  })
  public async getProfile(msg: any) {
    const { trackingSessionId } = msg;

    const session = await this.geoTrackingSessionService.findOne(trackingSessionId, false);
    const locationHistory = await this.geoLocationService.getLocationHistory(trackingSessionId);

    return formatGeoTrackingSession(session, locationHistory);
  }

  @RabbitRPC({
    exchange: EXCHANGES.GEO_TRACKING,
    routingKey: ROUTING_KEYS.IS_TRACKING_SESSION_STREAK,
    queue: QUEUES.IS_TRACKING_SESSION_STREAK,
  })
  public async isTrackingSessionStreak(msg: any) {
    const { accountId } = msg;

    return await this.geoTrackingSessionService.isTrackingSessionStreak(accountId);
  }
}

export { GeoTrackingSessionHandler };
