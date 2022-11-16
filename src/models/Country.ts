import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

export type CountryDocument = Country & Document & SchemaTimestampsConfig;

@Schema()
export class Country {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  name: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
