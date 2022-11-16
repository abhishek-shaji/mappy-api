import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AbstractCRUDService } from './AbstractCRUDService';
import { File } from '../models/File';
import { formatFile } from '../formatters/formatFile';

@Injectable()
export class FileService extends AbstractCRUDService {
  constructor(@InjectModel(File.name) private readonly fileModel: Model<File>) {
    super(fileModel, formatFile);
  }
}
