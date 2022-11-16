import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';

import { GeoTrackingSessionController } from '../controllers/GeoTrackingSessionController';
import { GeoTrackingSessionService } from '../services/GeoTrackingSessionService';
import { GeoTrackingSession, GeoTrackingSessionSchema } from '../models/GeoTrackingSession';
import { GeoLocation, GeoLocationSchema } from '../models/GeoLocation';
import { GeoLocationController } from '../controllers/GeoLocationController';
import { GeoLocationService } from '../services/GeoLocationService';
import { MapboxService } from '../services/MapboxService';
import { HaversineService } from '../services/HaversineService';
import { RoutingKeys } from '../enum/RoutingKeys';
import { GeoTrackingSessionHandler } from '../event-handlers/GeoTrackingSessionHandler';
import { GeoLocationPoint } from '../models/GeoLocationPoint';
import { NoteController } from '../controllers/NoteController';
import { NoteService } from '../services/NoteService';
import { Note, NoteSchema } from '../models/Note';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: GeoTrackingSession.name, schema: GeoTrackingSessionSchema },
      { name: GeoLocation.name, schema: GeoLocationSchema },
      { name: GeoLocationPoint.name, schema: GeoLocationSchema },
      { name: Note.name, schema: NoteSchema },
    ]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: RoutingKeys.GeoTrackingSessionTerminated,
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [GeoTrackingSessionController, GeoLocationController, NoteController],
  providers: [
    GeoTrackingSessionService,
    GeoLocationService,
    MapboxService,
    HaversineService,
    GeoTrackingSessionHandler,
    NoteService,
  ],
  exports: [],
})
export class GeolocationModule {}
