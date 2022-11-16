import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

export type RewardDocument = Reward & Document & SchemaTimestampsConfig;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Reward {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
