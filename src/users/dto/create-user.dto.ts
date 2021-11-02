import {
  IsAlpha,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsAlpha()
  @IsDefined()
  firstName: string;

  @IsString()
  @IsAlpha()
  @IsDefined()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsDefined()
  password: string;

  createdAt: string;
}
