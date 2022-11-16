import { Controller, Request, UseGuards, Param, Post, Body, Get, Query } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { GeoLocationService } from '../services/GeoLocationService';
import { NoteService } from '../services/NoteService';
import { GeoTrackingSessionService } from '../services/GeoTrackingSessionService';

@Controller('geo-location')
export class GeoLocationController {
  constructor(
    private readonly geoLocationService: GeoLocationService,
    private readonly noteService: NoteService,
    private readonly geoTrackingSessionService: GeoTrackingSessionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':sessionId')
  async addGeoLocationData(@Request() req, @Param('sessionId') sessionId, @Body() data) {
    const accountId = req.user._id;
    await this.geoTrackingSessionService.verifySessionValidity(sessionId);
    const { _id, speed, heading, accuracy, altitude, latitude, longitude, altitudeAccuracy } =
      await this.geoLocationService.addGeoLocationToSession(sessionId, data, accountId);

    return {
      id: _id,
      speed,
      heading,
      accuracy,
      altitude,
      latitude,
      longitude,
      altitudeAccuracy,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('map-data/:accountId')
  async findNearby(
    @Request() req,
    @Query('latitude') latitude,
    @Query('latitudeDelta') latitudeDelta,
    @Query('longitude') longitude,
    @Query('longitudeDelta') longitudeDelta,
  ) {
    const accountId = req.user._id;

    const heatmap = await this.geoLocationService.getHeatMapCoordinatesByRegion(
      {
        latitude: parseFloat(latitude),
        latitudeDelta: parseFloat(latitudeDelta),
        longitude: parseFloat(longitude),
        longitudeDelta: parseFloat(longitudeDelta),
      },
      accountId,
    );

    const notes = await this.noteService.getNotesByRegion(
      {
        latitude: parseFloat(latitude),
        latitudeDelta: parseFloat(latitudeDelta),
        longitude: parseFloat(longitude),
        longitudeDelta: parseFloat(longitudeDelta),
      },
      accountId,
    );

    return { heatmap, notes };
  }
}
