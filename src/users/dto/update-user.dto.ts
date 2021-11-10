import { IsAlpha, IsEmail, IsString, IsUrl } from 'class-validator';

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
}
