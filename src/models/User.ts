import { Roles } from '../enum/Roles';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from './Profile';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, unique: true })
  fbAccountId?: string;

  @Prop({ type: String, unique: true })
  appleUserId?: string;

  @Prop({ type: String })
  password?: string;

  @Prop([
    {
      type: String,
      enum: Roles,
    },
  ])
  roles: Roles[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  profile: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
