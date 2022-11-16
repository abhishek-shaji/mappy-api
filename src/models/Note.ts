import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GeoLocationPoint } from './GeoLocationPoint';

export type NoteDocument = Note & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Note {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: String, required: true })
  accountId: string;

  @Prop({ type: GeoLocationPoint, required: true })
  point: GeoLocationPoint;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
