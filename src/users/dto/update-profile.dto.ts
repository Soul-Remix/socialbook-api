import { IsDateString, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  bio?: string;

  @IsString()
  country?: string;

  @IsString()
  city?: string;

  @IsDateString()
  birthDate?: string;
}
