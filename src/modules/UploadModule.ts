import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './UserModule';
import { UploadController } from '../controllers/UploadController';
import { File, FileSchema } from '../models/File';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from '../services/S3Service';
import { FileService } from '../services/FileService';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    forwardRef(() => UserModule),
  ],
  controllers: [UploadController],
  providers: [S3Service, FileService],
})
export class UploadModule {}
