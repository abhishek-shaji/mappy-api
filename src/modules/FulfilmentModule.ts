import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './UserModule';
import { FulfilmentService } from '../services/FulfilmentService';
import { Fulfilment, FulfilmentSchema } from '../models/Fulfilment';
import { ProfileModule } from './ProfileModule';
import { RequestService } from '../services/RequestService';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Exchanges } from '../enum/Exchanges';
import { FulfilmentController } from '../controllers/FulfilmentController';
import { ConfigModule } from '@nestjs/config';
import { FulfilmentHandler } from '../event-handlers/FulfilmentHandler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: Fulfilment.name, schema: FulfilmentSchema }]),
    forwardRef(() => UserModule),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: Exchanges.Profile,
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
