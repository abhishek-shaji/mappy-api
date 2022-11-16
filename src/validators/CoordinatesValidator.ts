import { IsNotEmpty, IsNumber } from 'class-validator';

export class CoordinatesValidator {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
