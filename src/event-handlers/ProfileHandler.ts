import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

import { Exchanges } from '../enum/Exchanges';
import { ProfileService } from '../services/ProfileService';
import { UserService } from '../services/UserService';
import { Queues } from '../enum/Queues';
import { RoutingKeys } from '../enum/RoutingKeys';
import { ProfileStatisticsService } from '../services/ProfileStatisticsService';

@Injectable()
class ProfileHandler {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly profileStatisticsService: ProfileStatisticsService,
  ) {}

  @RabbitRPC({
    exchange: Exchanges.Profile,
    routingKey: RoutingKeys.GetProfileData,
    queue: Queues.GetProfileData,
  })
  public async getProfile(msg: any) {
    const { accountId } = msg;
    const user: any = await this.userService.findByAccountId(accountId);

    return await this.profileService.findOneByProfileId(user.profile._id);
  }

  @RabbitSubscribe({
    exchange: Exchanges.Profile,
    routingKey: RoutingKeys.HandoutReward,
    queue: Queues.ProfileHandoutReward,
  })
  async processProfileStatsEvent(msg: any = {}) {
    const { profileId, rewardId } = msg;
    console.info(`Handing our reward: ${rewardId}`);

    try {
      await this.profileService.handoutReward(profileId, rewardId);
      console.info('Reward handout successful');
    } catch (e) {
      console.error('Reward handout failed..', e);
    }
  }

  @RabbitSubscribe({
    exchange: Exchanges.GeoTracking,
    routingKey: RoutingKeys.GeoTrackingSessionTerminated,
    queue: Queues.UpdateProfileStatistics,
  })
  async updateProfileStatistics(msg: any = {}, amqpMsg: ConsumeMessage) {
    const accountId = amqpMsg.properties.headers['x-account-id'];
    const { trackingSessionId } = msg;
    const user = await this.userService.findByAccountId(accountId);
    //@ts-ignore
    const profile: any = await this.profileService.findOneByProfileId(user.profile.id, undefined, false);
    const profileStatistics = await this.profileStatisticsService.findOne(String(user.profile.statistics), false);

    try {
      await this.profileStatisticsService.updateProfileStatistics(
        accountId,
        trackingSessionId,
        profile,
        profileStatistics,
      );

      console.info(`Profile #${profileStatistics._id} updated`, profileStatistics, accountId);

      await this.amqpConnection.publish(
        Exchanges.Profile,
        RoutingKeys.ProfileDataUpdated,
        {},
        { headers: { 'x-account-id': accountId } },
      );
    } catch (e) {
      console.error(`Failed to update user: ${accountId}`, e);
    }
  }
}

export { ProfileHandler };
