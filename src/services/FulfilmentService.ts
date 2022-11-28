import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Fulfilment, FulfilmentDocument } from '../models/Fulfilment';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ProfileDocument } from '../models/Profile';
import { FulfilmentPropertyType } from '../enum/FulfilmentPropertyType';
import { FulfilmentOperatorType } from '../enum/FulfilmentOperator';
import { AbstractCRUDService } from './AbstractCRUDService';
import { formatFulfilment } from '../formatters/formatFulfilment';
import { EXCHANGES } from '../constants/exchanges';
import { ROUTING_KEYS } from '../constants/routingKeys';

@Injectable()
export class FulfilmentService extends AbstractCRUDService {
  constructor(
    @InjectModel(Fulfilment.name) private readonly fulfilmentModel: Model<Fulfilment>,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super(fulfilmentModel, formatFulfilment);
  }

  findActiveFulfilments = async (profile: ProfileDocument) => {
    const currentDate = new Date();
    return this.fulfilmentModel.find({
      validFrom: {
        $lte: currentDate,
      },
      validTo: {
        $gte: currentDate,
      },
      reward: {
        $nin: profile.rewards,
      },
    });
  };

  extractPropertyValueFromProfile = (propertyName: FulfilmentPropertyType, profile: ProfileDocument) =>
    profile.statistics[propertyName];

  isValid = (target: number, value: number, operator: FulfilmentOperatorType) => {
    switch (operator) {
      case FulfilmentOperatorType.MoreThan:
        return value > target;
      case FulfilmentOperatorType.MoreThanOrEqualTo:
        return value >= target;
      case FulfilmentOperatorType.LessThan:
        return value < target;
      case FulfilmentOperatorType.LessThanOrEqualTo:
        return value <= target;
      case FulfilmentOperatorType.EqualTo:
        return value === target;
      default:
        return false;
    }
  };

  publishHandoutRewardEvent = async (profileId: string, rewardId: any) =>
    this.amqpConnection.publish(EXCHANGES.PROFILE, ROUTING_KEYS.HANDOUT_REWARD, {
      profileId,
      rewardId,
    });

  processFulfilment = async (Fulfilment: FulfilmentDocument, profile: ProfileDocument) => {
    const { operator, target, property, reward } = Fulfilment;
    const propertyValue = this.extractPropertyValueFromProfile(property, profile);

    const isValid = this.isValid(target, propertyValue, operator);

    if (isValid) {
      await this.publishHandoutRewardEvent(profile.id, reward);
    }
  };
}
