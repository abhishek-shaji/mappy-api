import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FullNameValidator {
  givenName?: string;

  familyName?: string;
}

export class AppleAuthValidator {
  @IsString()
  @IsNotEmpty()
  identityToken: string;

  email?: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FullNameValidator)
  fullName: FullNameValidator;
}
