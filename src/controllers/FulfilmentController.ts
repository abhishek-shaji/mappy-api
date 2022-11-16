import { Controller, Request, UseGuards, Body, Param, Post, Patch, Get } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { FulfilmentService } from '../services/FulfilmentService';
import { FulfilmentTaskValidator } from '../validators/FulfilmentTaskValidator';

@Controller('fulfilment')
export class FulfilmentController {
  constructor(private readonly fulfilmentService: FulfilmentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllReward(@Request() req) {
    return await this.fulfilmentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getReward(@Request() req, @Param('id') id: string) {
    return await this.fulfilmentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReward(@Request() req, @Body() body: FulfilmentTaskValidator) {
    return await this.fulfilmentService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateReward(@Request() req, @Param('id') rewardId: string, @Body() body: FulfilmentTaskValidator) {
    return await this.fulfilmentService.update(rewardId, body);
  }
}
