import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { GeoTrackingSession } from './GeoTrackingSession';
import { GeoLocationPoint } from './GeoLocationPoint';

export type GeoLocationDocument = GeoLocation & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class GeoLocation {
  @Prop({ type: String, required: true })
  accountId: string;

  @Prop({ type: GeoLocationPoint, required: true })
  point: GeoLocationPoint;

  @Prop({ type: Number })
  speed: number;

  @Prop({ type: Number })
  heading: number;

  @Prop({ type: Number })
  accuracy: number;

  @Prop({ type: Number })
  altitude: number;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: Number })
  altitudeAccuracy: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GeoTrackingSession' })
  session: GeoTrackingSession;
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);
