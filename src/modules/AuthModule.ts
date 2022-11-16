import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { JwtStrategy } from '../strategies/JwtStrategy';
import { FacebookStrategy } from '../strategies/FacebookStrategy';
import { LocalStrategy } from '../strategies/LocalStrategy';
import { PasswordAuthController } from '../controllers/PasswordAuthController';
import { AuthService } from '../services/AuthService';
import { UserModule } from './UserModule';
import { FacebookAuthController } from '../controllers/FacebookAuthController';
import { FacebookAuthService } from '../services/FacebookAuthService';
import { AppleAuthController } from '../controllers/AppleAuthController';
import { AppleAuthService } from '../services/AppleAuthService';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15d' },
    }),
    UserModule,
    PassportModule,
  ],
  controllers: [PasswordAuthController, FacebookAuthController, AppleAuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, FacebookStrategy, FacebookAuthService, AppleAuthService],
})
export class AuthModule {}
