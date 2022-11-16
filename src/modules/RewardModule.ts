import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './UserModule';
import { Reward, RewardSchema } from '../models/Reward';
import { RewardService } from '../services/RewardService';
import { RewardController } from '../controllers/RewardController';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reward.name, schema: RewardSchema }]), forwardRef(() => UserModule)],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
