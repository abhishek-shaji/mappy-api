import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import verifyAppleToken from 'verify-apple-id-token';

interface AppleIdentityTokenBody {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  c_hash: string;
  email: string;
  email_verified: string;
  auth_time: string;
  nonce_supported: boolean;
  real_user_status: number;
}

@Injectable()
export class AppleAuthService {
  verify = async (identityToken: string): Promise<AppleIdentityTokenBody> => {
    try {
      return verifyAppleToken({
        idToken: identityToken,
        clientId: process.env.IOS_APP_CLIENT_ID,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid identity token');
    }
  };
}
