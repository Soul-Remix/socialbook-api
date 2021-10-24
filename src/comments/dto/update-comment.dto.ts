import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;
}
