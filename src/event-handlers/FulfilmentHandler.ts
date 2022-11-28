import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { FulfilmentService } from '../services/FulfilmentService';
import { EXCHANGES } from '../constants/exchanges';
import { QUEUES } from '../constants/queues';
import { ROUTING_KEYS } from '../constants/routingKeys';

@Injectable()
class FulfilmentHandler {
  constructor(private readonly fulfilmentService: FulfilmentService, private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: EXCHANGES.PROFILE,
    routingKey: ROUTING_KEYS.PROFILE_DATA_UPDATED,
    queue: QUEUES.FULFILMENT_UPDATE_PROGRESS,
  })
  async processProfileStatsEvent(msg: any = {}, amqpMsg: ConsumeMessage) {
    console.info('Processing fulfilments...');
    const accountId = amqpMsg.properties.headers['x-account-id'];

    try {
      const profile = await this.amqpConnection.request<any>({
        exchange: EXCHANGES.PROFILE,
        routingKey: ROUTING_KEYS.GET_PROFILE_DATA,
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
