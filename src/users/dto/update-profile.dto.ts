import { IsDateString, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  bio?: string;

  @IsString()
  country?: string;

  @IsString()
  livesIn?: string;

  @IsString()
  gender?: string;

  @IsDateString()
  birthDate?: string;
}
