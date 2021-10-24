import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDefined()
  @IsNumber()
  postId: number;
}
