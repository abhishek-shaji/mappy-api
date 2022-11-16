import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Length, Weight } from '../enum/Units';

export class LengthValidator {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Length)
  unit: Length;
}

export class WeightValidator {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Weight)
  unit: Weight;
}
