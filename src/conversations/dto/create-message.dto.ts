import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsDefined()
  @IsString()
  text: string;

  @IsDefined()
  @IsNumber()
  conversationId: number;

  @IsDefined()
  @IsNumber()
  receiverId: number;
}
