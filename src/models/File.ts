import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTimestampsConfig } from 'mongoose';

export type FileDocument = File & Document & SchemaTimestampsConfig;

@Schema({ timestamps: { createdAt: true } })
export class File {
  @Prop({ type: String, required: true })
  filename: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true })
  bucket: string;

  @Prop({ type: String, required: true })
  accountId: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
