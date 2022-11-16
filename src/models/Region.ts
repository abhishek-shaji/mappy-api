import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

export type RegionDocument = Region & Document & SchemaTimestampsConfig;

@Schema()
export class Region {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  name: string;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
