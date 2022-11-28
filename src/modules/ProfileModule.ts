import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ScheduleModule } from '@nestjs/schedule';

import { ProfileController } from '../controllers/ProfileController';
import { ProfileService } from '../services/ProfileService';
import { Profile, ProfileSchema } from '../models/Profile';
import { ProfileStatistics, ProfileStatisticsSchema } from '../models/ProfileStatistics';
import { ProfileStatisticsService } from '../services/ProfileStatisticsService';
import { UserModule } from './UserModule';
import { ProfileHandler } from '../event-handlers/ProfileHandler';
import { HaversineService } from '../services/HaversineService';
import { MapboxService } from '../services/MapboxService';
import { Region, RegionSchema } from '../models/Region';
import { Country, CountrySchema } from '../models/Country';
import { RegionAndCountryService } from '../services/RegionAndCountryService';
import { EXCHANGES } from '../constants/exchanges';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: ProfileStatistics.name, schema: ProfileStatisticsSchema },
      { name: Region.name, schema: RegionSchema },
      { name: Country.name, schema: CountrySchema },
    ]),
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
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileStatisticsService,
    ProfileHandler,
    HaversineService,
    MapboxService,
    RegionAndCountryService,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
