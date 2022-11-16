import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Reward } from '../models/Reward';
import { AbstractCRUDService } from './AbstractCRUDService';
import { formatReward } from '../formatters/formatReward';

@Injectable()
export class RewardService extends AbstractCRUDService {
  constructor(@InjectModel(Reward.name) private readonly rewardModel: Model<Reward>) {
    super(rewardModel, formatReward);
  }
}
