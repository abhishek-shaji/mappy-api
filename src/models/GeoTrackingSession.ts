import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';
import * as mongoose from 'mongoose';

import { User } from './User';
import { GeoLocation } from './GeoLocation';

export type GeoTrackingSessionDocument = GeoTrackingSession & Document & SchemaTimestampsConfig;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class GeoTrackingSession {
  @Prop({ type: String, required: true })
  startTime: Date;

  @Prop({ type: String })
  endTime: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const GeoTrackingSessionSchema = SchemaFactory.createForClass(GeoTrackingSession);
