import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { RegistrationFormValidator } from '../validators/RegistrationFormValidator';
import { formatUser } from '../formatters/formatUser';

@Controller('auth')
export class PasswordAuthController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('authenticate')
  async authenticate(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async signup(@Body() body: RegistrationFormValidator) {
    const { email, firstname, lastname, password } = body;

    const user = await this.userService.createUser(email, firstname, lastname, password);

    return {
      accessToken: this.authService.generateAccessToken(user),
      user: { id: user._id, email: user.email, roles: user.roles },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getProfile(@Request() req) {
    return formatUser(req.user);
  }
}
