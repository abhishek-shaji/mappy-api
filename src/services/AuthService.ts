import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './UserService';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UserDocument } from '../models/User';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.password) {
      throw new ConflictException();
    }

    if (user && (await bcryptjs.compare(password, user.password))) {
      return { email: user.email, _id: user._id };
    }
  }

  login = async (user: UserDocument) => {
    return {
      accessToken: this.generateAccessToken(user),
      user: {
        id: user._id,
        email: user.email,
      },
    };
  };

  generateAccessToken = ({ email, _id, roles }: UserDocument) => {
    const payload = { email, roles, sub: _id };

    return this.jwtService.sign(payload);
  };
}
