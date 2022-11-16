import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { FulfilmentService } from '../services/FulfilmentService';
import { Exchanges } from '../enum/Exchanges';
import { RoutingKeys } from '../enum/RoutingKeys';
import { Queues } from '../enum/Queues';

@Injectable()
class FulfilmentHandler {
  constructor(private readonly fulfilmentService: FulfilmentService, private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: Exchanges.Profile,
    routingKey: RoutingKeys.ProfileDataUpdated,
    queue: Queues.FulfilmentUpdateProgress,
  })
  async processProfileStatsEvent(msg: any = {}, amqpMsg: ConsumeMessage) {
    console.info('Processing fulfilments...');
    const accountId = amqpMsg.properties.headers['x-account-id'];

    try {
      const profile = await this.amqpConnection.request<any>({
        exchange: Exchanges.Profile,
        routingKey: RoutingKeys.GetProfileData,
        payload: {
          accountId,
        },
      });

      const fulfilments = await this.fulfilmentService.findActiveFulfilments(profile);
      for (const fulfilment of fulfilments) {
        await this.fulfilmentService.processFulfilment(fulfilment, profile);
      }

      console.log(`Successfully processed ${fulfilments.length} fulfilments`);
    } catch (e) {
      console.log('Failed to process fulfilment', e);
    }
  }
}

export { FulfilmentHandler };
