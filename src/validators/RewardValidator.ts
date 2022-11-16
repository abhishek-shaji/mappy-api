import { IsNotEmpty, IsString } from 'class-validator';

export class RewardValidator {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
