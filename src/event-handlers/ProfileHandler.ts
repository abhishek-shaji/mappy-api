import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConsumeMessage } from 'amqplib';

import { ProfileService } from '../services/ProfileService';
import { UserService } from '../services/UserService';
import { ProfileStatisticsService } from '../services/ProfileStatisticsService';
import { EXCHANGES } from '../constants/exchanges';
import { QUEUES } from '../constants/queues';
import { ROUTING_KEYS } from '../constants/routingKeys';

@Injectable()
class ProfileHandler {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
    private readonly profileStatisticsService: ProfileStatisticsService,
  ) {}

  @RabbitRPC({
    exchange: EXCHANGES.PROFILE,
    routingKey: ROUTING_KEYS.GET_PROFILE_DATA,
    queue: QUEUES.GET_PROFILE_DATA,
  })
  public async getProfile(msg: any) {
    const { accountId } = msg;
    const user: any = await this.userService.findByAccountId(accountId);

    return await this.profileService.findOneByProfileId(user.profile._id);
  }

  @RabbitSubscribe({
    exchange: EXCHANGES.PROFILE,
    routingKey: ROUTING_KEYS.HANDOUT_REWARD,
    queue: QUEUES.PROFILE_HANDOUT_REWARD,
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
    exchange: EXCHANGES.GEO_TRACKING,
    routingKey: ROUTING_KEYS.GEO_TRACKING_SESSION_TERMINATED,
    queue: QUEUES.UPDATE_PROFILE_STATISTICS,
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
        EXCHANGES.PROFILE,
        ROUTING_KEYS.PROFILE_DATA_UPDATED,
        {},
        { headers: { 'x-account-id': accountId } },
      );
    } catch (e) {
      console.error(`Failed to update user: ${accountId}`, e);
    }
  }
}

export { ProfileHandler };
