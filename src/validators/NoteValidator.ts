import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CoordinatesValidator } from './CoordinatesValidator';
import { Type } from 'class-transformer';

export class NoteValidator {
  @IsString()
  @IsNotEmpty()
  text: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CoordinatesValidator)
  coordinates: CoordinatesValidator;
}
