import { Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Exchanges } from '../enum/Exchanges';
import { Queues } from '../enum/Queues';
import { RoutingKeys } from '../enum/RoutingKeys';
import { GeoLocationService } from '../services/GeoLocationService';
import { formatGeoTrackingSession } from '../formatters/formatGeoTrackingSession';
import { GeoTrackingSessionService } from '../services/GeoTrackingSessionService';

@Injectable()
class GeoTrackingSessionHandler {
  constructor(
    private readonly geoLocationService: GeoLocationService,
    private readonly geoTrackingSessionService: GeoTrackingSessionService,
  ) {}

  @RabbitRPC({
    exchange: Exchanges.GeoTracking,
    routingKey: RoutingKeys.GetGeoTrackingSession,
    queue: Queues.GeoGeoLocationTracking,
  })
  public async getProfile(msg: any) {
    const { trackingSessionId } = msg;

    const session = await this.geoTrackingSessionService.findOne(trackingSessionId, false);
    const locationHistory = await this.geoLocationService.getLocationHistory(trackingSessionId);

    return formatGeoTrackingSession(session, locationHistory);
  }

  @RabbitRPC({
    exchange: Exchanges.GeoTracking,
    routingKey: RoutingKeys.IsTrackingSessionStreak,
    queue: Queues.IsTrackingSessionStreak,
  })
  public async isTrackingSessionStreak(msg: any) {
    const { accountId } = msg;

    return await this.geoTrackingSessionService.isTrackingSessionStreak(accountId);
  }
}

export { GeoTrackingSessionHandler };
