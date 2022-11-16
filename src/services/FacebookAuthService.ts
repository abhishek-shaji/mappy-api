import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

interface FbGraphResponse {
  id: string;
  email?: string;
  name: string;
  firstname: string;
  lastname: string;
}

@Injectable()
export class FacebookAuthService {
  extractFirstLastNames = (fullName: string) => {
    const [firstname, lastname] = fullName.split(' ');
    return { firstname, lastname };
  };

  fetchProfile = async (token: string): Promise<FbGraphResponse> => {
    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const response = await axios.get(
      `https://graph.facebook.com/me?fields=id,email,name&access_token=${token}&debug=all`,
    );

    if (response.status !== 200) {
      throw new InternalServerErrorException('An error occurred while fetching profile');
    }

    return {
      ...response.data,
      ...this.extractFirstLastNames(response.data.name),
    };
  };
}
