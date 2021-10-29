import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsAlpha()
  firstName: string;

  @IsString()
  @IsAlpha()
  lastName: string;

  @IsUrl()
  profilePicture: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
