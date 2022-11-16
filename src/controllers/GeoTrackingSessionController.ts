import { Controller, Request, UseGuards, Param, Post, Get } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { GeoTrackingSessionService } from '../services/GeoTrackingSessionService';
import { MapboxService } from '../services/MapboxService';
import { GeoLocationService } from '../services/GeoLocationService';

@Controller('geo-location/session')
export class GeoTrackingSessionController {
  constructor(
    private readonly geoTrackingSessionService: GeoTrackingSessionService,
    private readonly mapboxService: MapboxService,
    private readonly geoLocationService: GeoLocationService,
  ) {}

  @Post(':sessionId/calculate')
  async calculate(@Request() req, @Param('sessionId') sessionId) {
    const locations = await this.geoLocationService.findBySessionId(sessionId);
    await this.mapboxService.calculateDistanceTravelled(locations);
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':accountId')
  async initiateGeoTrackingSession(@Request() req, @Param('accountId') accountId) {
    const { _id, startTime, endTime, createdAt, updatedAt } =
      await this.geoTrackingSessionService.initiateTrackingSession(req.user);

    return {
      id: _id,
      startTime,
      endTime,
      createdAt,
      updatedAt,
      locationHistory: [],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':accountId/terminate')
  async terminateGeoTrackingSession(@Request() req, @Param('accountId') accountId) {
    return await this.geoTrackingSessionService.terminateActiveTrackingSession(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':accountId')
  async getActiveSession(@Request() req, @Param('accountId') accountId) {
    const geoTrackingSession = await this.geoTrackingSessionService.findActiveSession(req.user);

    if (geoTrackingSession) {
      return geoTrackingSession;
    }

    return null;
  }
}
