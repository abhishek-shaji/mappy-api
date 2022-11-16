import {
  Controller,
  Request,
  UseGuards,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../services/S3Service';
import { FileService } from '../services/FileService';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service, private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':accountId')
  @UseInterceptors(FileInterceptor('file'))
  async createReward(@Request() req, @Param('accountId') accountId: string, @UploadedFile() uploadedFile) {
    if (accountId !== String(req.user._id)) {
      throw new UnauthorizedException();
    }

    const {
      Location: location,
      Bucket: bucket,
      filename,
    } = await this.s3Service.upload(uploadedFile, 'profile/picture');

    return this.fileService.create({ filename, location, bucket, accountId: req.user._id });
  }
}
