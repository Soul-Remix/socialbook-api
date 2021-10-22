import { IsNumber } from 'class-validator';

export class FriendRequestDto {
  @IsNumber()
  sender: number;

  @IsNumber()
  receiver: number;
}
