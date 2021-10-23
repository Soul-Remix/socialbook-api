import { IsDefined, IsString, MinLength } from 'class-validator';

export class SearchPostsDto {
  @IsString()
  @MinLength(3)
  @IsDefined()
  search: string;
}
