import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Profile, ProfileDocument } from '../models/Profile';
import { ProfileStatisticsService } from './ProfileStatisticsService';
import { formatProfile } from '../formatters/formatProfile';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    private readonly profileStatisticsService: ProfileStatisticsService,
  ) {}

  createProfile = async (data: Profile): Promise<ProfileDocument> => {
    const profileStatistics = await this.profileStatisticsService.createProfileStatistics();
    const profile = new this.profileModel({ ...data, statistics: profileStatistics._id });

    await profile.save();
    return profile;
  };

  findOneByProfileId = async (profileId: string, populate: string = 'statistics', shouldFormat = true) => {
    const profile = await this.profileModel.findOne({ _id: profileId }).populate(populate);

    if (shouldFormat) {
      return formatProfile(profile);
    }

    return profile;
  };

  editProfile = async (_id: string, data: any) => {
    return this.profileModel.findOneAndUpdate({ _id }, { $set: { ...data, isInstantiated: true } }, { new: true });
  };

  handoutReward = async (_id: string, rewardId: any) => {
    const profile = await this.profileModel.findOne({ _id });
    profile.rewards.push(rewardId);

    return profile.save();
  };
}
