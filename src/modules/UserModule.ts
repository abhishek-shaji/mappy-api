import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '../services/UserService';
import { User, UserSchema } from '../models/User';
import { ProfileModule } from './ProfileModule';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), ProfileModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
