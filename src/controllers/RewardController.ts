import { Controller, Request, UseGuards, Body, Param, Post, Patch, Get } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RewardService } from '../services/RewardService';
import { RewardValidator } from '../validators/RewardValidator';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllReward(@Request() req) {
    return await this.rewardService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getReward(@Request() req, @Param('id') rewardId: string) {
    return await this.rewardService.findOne(rewardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReward(@Request() req, @Body() body: RewardValidator) {
    return await this.rewardService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateReward(@Request() req, @Param('id') rewardId: string, @Body() body: RewardValidator) {
    return await this.rewardService.update(rewardId, body);
  }
}
