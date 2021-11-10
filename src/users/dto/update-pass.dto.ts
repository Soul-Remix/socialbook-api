import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class updatePassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  oldPass: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPass: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  ConfPass: string;
}
