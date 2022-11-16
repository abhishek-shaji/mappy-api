import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './modules/AuthModule';
import { ProfileModule } from './modules/ProfileModule';
import { UserModule } from './modules/UserModule';
import { GeolocationModule } from './modules/GeolocationModule';
import { RewardModule } from './modules/RewardModule';
import { FulfilmentModule } from './modules/FulfilmentModule';
import { UploadModule } from './modules/UploadModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    LoggerModule.forRoot(),
    AuthModule,
    ProfileModule,
    UserModule,
    RewardModule,
    GeolocationModule,
    FulfilmentModule,
    UploadModule,
  ],
})
export class AppModule {}
