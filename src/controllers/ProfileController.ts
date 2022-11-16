import { Controller, Request, UseGuards, Body, Patch, Param, Get } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { ProfileService } from '../services/ProfileService';
import { ProfileFormValidator } from '../validators/ProfileFormValidator';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProfileStatisticsService } from '../services/ProfileStatisticsService';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileStatisticsService: ProfileStatisticsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':accountId')
  async edit(@Request() req, @Param('accountId') accountId, @Body() body: ProfileFormValidator) {
    return await this.profileService.editProfile(req.user.profile, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':accountId')
  async view(@Request() req, @Param('accountId') accountId) {
    return await this.profileService.findOneByProfileId(req.user.profile, 'statistics rewards picture');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.profileStatisticsService.resetDailyProfileStats();
    console.log('Successfully reset statistics');
  }
}
