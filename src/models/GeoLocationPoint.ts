import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GeoLocationPointDocument = GeoLocationPoint & Document;

@Schema({})
export class GeoLocationPoint {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @Prop({ type: [Number], required: true })
  coordinates: [number, number];
}

export const GeoLocationPointSchema = SchemaFactory.createForClass(GeoLocationPoint);
