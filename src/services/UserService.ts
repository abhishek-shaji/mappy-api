import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { User } from '../models/User';
import { ProfileService } from './ProfileService';
import { Roles } from '../enum/Roles';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly profileService: ProfileService,
  ) {}

  findUserByEmail = async (email: string) => this.userModel.findOne({ email });

  findUserByFacebookAccountId = async (fbAccountId: string) => this.userModel.findOne({ fbAccountId });

  findUserByAppleId = async (appleUserId: string) => this.userModel.findOne({ appleUserId });

  findByAccountId = async (accountId: string) => this.userModel.findOne({ _id: accountId }).populate('profile');

  createUser = async (
    email: string,
    firstname: string,
    lastname: string,
    password?: string,
    fbAccountId?: string,
    appleUserId?: string,
  ) => {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const profile = await this.profileService.createProfile({ firstname, lastname });
    const userData: User = { email, roles: [Roles.RoleUser], profile: profile._id, fbAccountId, appleUserId };

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      userData.password = await bcryptjs.hash(password, salt);
    }

    const newUser = new this.userModel(userData);
    await newUser.save();

    return newUser;
  };
}
