import { Controller, Req, Query, Post } from '@nestjs/common';

import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';
import { FacebookAuthService } from '../services/FacebookAuthService';
import { formatUser } from '../formatters/formatUser';

@Controller('/auth/facebook')
export class FacebookAuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly facebookService: FacebookAuthService,
  ) {}

  @Post('authenticate')
  async facebookLoginRedirect(@Req() req: any, @Query('token') token: string): Promise<any> {
    const {
      id,
      email = 'invalid.email@fb.com',
      name,
      firstname = '',
      lastname = '',
    } = await this.facebookService.fetchProfile(token);

    const oldFacebookUser = await this.userService.findUserByFacebookAccountId(id);

    if (oldFacebookUser) {
      console.info(oldFacebookUser, 'User exists already');

      return {
        accessToken: this.authService.generateAccessToken(oldFacebookUser),
        user: formatUser(oldFacebookUser),
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

    const newUser = await this.userService.createUser(email, firstname, lastname, undefined, id);

    console.info(newUser, 'New user created');

    return {
      accessToken: this.authService.generateAccessToken(newUser),
      user: formatUser(newUser),
    };
  }
}
