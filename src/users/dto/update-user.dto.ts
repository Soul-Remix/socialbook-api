import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
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

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
