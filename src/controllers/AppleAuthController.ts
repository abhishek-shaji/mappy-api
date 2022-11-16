import { Controller, Req, Query, Post, Body, BadRequestException } from '@nestjs/common';

import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { AppleAuthService } from '../services/AppleAuthService';
import { AppleAuthValidator } from '../validators/AppleAuthValidator';
import { formatUser } from '../formatters/formatUser';

@Controller('/auth/apple')
export class AppleAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly appleAuthService: AppleAuthService,
  ) {}

  @Post('authenticate')
  async facebookLoginRedirect(
    @Req() req: any,
    @Body() { identityToken, email, fullName: { givenName, familyName }, user }: AppleAuthValidator,
  ): Promise<any> {
    await this.appleAuthService.verify(identityToken);

    const oldAppleId = await this.userService.findUserByAppleId(user);

    if (oldAppleId) {
      console.info(oldAppleId, 'User exists already');

      return {
        accessToken: this.authService.generateAccessToken(oldAppleId),
        user: formatUser(oldAppleId),
      };
    }

    if (email) {
      const oldPasswordUser = email && (await this.userService.findUserByEmail(email));

      if (oldPasswordUser) {
        console.info(oldPasswordUser, 'User exists already');

        return {
          accessToken: this.authService.generateAccessToken(oldPasswordUser),
          user: formatUser(oldPasswordUser),
        };
      }
    }

    if (!givenName || !familyName || !email) {
      throw new BadRequestException('User data needed to create an account unavailable');
    }

    const newUser = await this.userService.createUser(email, givenName, familyName, undefined, undefined, user);

    console.info(newUser, 'New user created');

    return {
      accessToken: this.authService.generateAccessToken(newUser),
      user: formatUser(newUser),
    };
  }
}
