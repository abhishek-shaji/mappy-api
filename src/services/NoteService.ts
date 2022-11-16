import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Region } from '../types/geolocation';
import { Note } from '../models/Note';
import { getBoundsByRegion } from '../utils/getBoundsByRegion';
import { formatNote } from '../formatters/formatNote';
import { AbstractCRUDService } from './AbstractCRUDService';

@Injectable()
export class NoteService extends AbstractCRUDService {
  constructor(@InjectModel(Note.name) private readonly noteModel: Model<Note>) {
    super(noteModel, formatNote);
  }

  getNotesByRegion = async (region: Region, accountId: string) => {
    const bounds = getBoundsByRegion(region);
    const notes = await this.noteModel.find({
      point: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [bounds],
          },
        },
      },
      accountId,
    });

    const formattedNotes = notes.map((note) => formatNote(note));

    console.log(`Found ${formattedNotes.length} heatmap points for accountId: ${accountId}`);

    return formattedNotes;
  };
}
