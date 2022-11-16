import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';

const uuid = require('uuid');

import { AbstractCRUDService } from './AbstractCRUDService';
import { File } from '../models/File';
import { formatFile } from '../formatters/formatFile';

@Injectable()
export class S3Service extends AbstractCRUDService {
  private s3: S3;

  constructor(@InjectModel(File.name) private readonly fileModel: Model<File>) {
    super(fileModel, formatFile);
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });
  }

  private extractFileExtension = (filename: string) => filename.split('.').pop();

  upload = async (file, directory: string = '') => {
    const { mimetype, originalname } = file;
    const fileExtension = this.extractFileExtension(originalname);
    const filename = `${uuid.v4()}.${fileExtension}`;

    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${directory ? `${directory}/` : ''}${filename}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const response = await this.s3.upload(params).promise();
      return { ...response, filename };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  };
}
