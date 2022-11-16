import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

import { Gender } from '../enum/Gender';
import { Length, Weight } from '../enum/Units';
import { LengthType, WeightType } from '../types/unit';
import { ProfileStatistics } from './ProfileStatistics';
import { Reward } from './Reward';
import { Region } from './Region';
import { Country } from './Country';
import { File } from './File';

export type ProfileDocument = Profile & Document & SchemaTimestampsConfig;

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Profile {
  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  picture?: File;

  @Prop({ type: String, enum: Gender })
  gender?: Gender;

  @Prop({ type: String })
  color?: string;

  @Prop({ type: Boolean })
  isInstantiated?: boolean;

  @Prop(
    raw({
      unit: { type: String, enum: Weight },
      value: { type: String },
    }),
  )
  weight?: WeightType;

  @Prop(
    raw({
      unit: { type: String, enum: Length },
      value: { type: String },
    }),
  )
  height?: LengthType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProfileStatistics' })
  statistics?: ProfileStatistics;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }])
  rewards?: Reward[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }])
  regions?: Region[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }])
  countries?: Country[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
