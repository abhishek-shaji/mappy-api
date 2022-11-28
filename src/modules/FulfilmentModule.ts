import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './UserModule';
import { FulfilmentService } from '../services/FulfilmentService';
import { Fulfilment, FulfilmentSchema } from '../models/Fulfilment';
import { ProfileModule } from './ProfileModule';
import { RequestService } from '../services/RequestService';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { FulfilmentController } from '../controllers/FulfilmentController';
import { ConfigModule } from '@nestjs/config';
import { FulfilmentHandler } from '../event-handlers/FulfilmentHandler';
import { EXCHANGES } from '../constants/exchanges';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: Fulfilment.name, schema: FulfilmentSchema }]),
    forwardRef(() => UserModule),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: EXCHANGES.PROFILE,
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
    ProfileModule,
  ],
  controllers: [FulfilmentController],
  providers: [RequestService, FulfilmentService, FulfilmentHandler],
})
export class FulfilmentModule {}
