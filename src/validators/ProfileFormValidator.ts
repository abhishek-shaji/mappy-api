import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Gender } from '../enum/Gender';
import { LengthValidator, WeightValidator } from './UnitValidator';
import { Type } from 'class-transformer';

export class ProfileFormValidator {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  picture?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LengthValidator)
  height: LengthValidator;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => WeightValidator)
  weight: WeightValidator;

  @IsString()
  @IsNotEmpty()
  color: string;
}
