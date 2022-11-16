import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

import { FulfilmentPropertyType } from '../enum/FulfilmentPropertyType';
import { FulfilmentOperatorType } from '../enum/FulfilmentOperator';
import { Reward } from './Reward';

export type FulfilmentDocument = Fulfilment & Document & SchemaTimestampsConfig;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Fulfilment {
  @Prop({ type: Date, required: true })
  validFrom: Date;

  @Prop({ type: Date, required: true })
  validTo: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, enum: FulfilmentPropertyType })
  property: FulfilmentPropertyType;

  @Prop({ type: String, required: true, enum: FulfilmentOperatorType })
  operator: FulfilmentOperatorType;

  @Prop({ type: Number, required: true })
  target: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' })
  reward: Reward;
}

export const FulfilmentSchema = SchemaFactory.createForClass(Fulfilment);
