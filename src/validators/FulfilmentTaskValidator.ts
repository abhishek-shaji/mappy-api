import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { FulfilmentPropertyType } from '../enum/FulfilmentPropertyType';
import { FulfilmentOperatorType } from '../enum/FulfilmentOperator';

export class FulfilmentTaskValidator {
  @IsString()
  @IsNotEmpty()
  validFrom: string;

  @IsString()
  @IsNotEmpty()
  validTo: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FulfilmentPropertyType)
  property: FulfilmentPropertyType;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FulfilmentOperatorType)
  operator: FulfilmentOperatorType;

  @IsNumber()
  @IsNotEmpty()
  target: number;

  @IsString()
  @IsNotEmpty()
  reward: string;
}
