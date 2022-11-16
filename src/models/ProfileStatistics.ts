import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

export type ProfileStatisticsDocument = ProfileStatistics & Document & SchemaTimestampsConfig;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class ProfileStatistics {
  @Prop({ type: Number, required: true })
  distanceTravelled: number;

  @Prop({ type: Number })
  distanceTravelledToday: number;

  @Prop({ type: Number, required: true })
  caloriesBurned: number;

  @Prop({ type: Number })
  caloriesBurnedToday: number;

  @Prop({ type: Number, required: true })
  currentStreak: number;

  @Prop({ type: Number, required: true })
  maxStreak: number;

  @Prop({ type: Number, required: true })
  countriesVisited: number;

  @Prop({ type: Number, required: true })
  regionsVisited: number;
}

export const ProfileStatisticsSchema = SchemaFactory.createForClass(ProfileStatistics);
