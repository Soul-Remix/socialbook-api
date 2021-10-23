import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  content?: string;

  @IsUrl()
  image?: string;
}
