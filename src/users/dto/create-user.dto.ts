import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsAlphanumeric()
  firstName: string;

  @IsString()
  @IsAlphanumeric()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
