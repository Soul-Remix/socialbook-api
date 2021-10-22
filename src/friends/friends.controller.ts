import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  // Return a list off all the user friends
  @Get(':id')
  findFriends(@Param('id') id: string) {
    return this.friendsService.findFriends(+id);
  }

  @Get()
  // Return a list off friends requests received by the user
  findRequests() {
    return this.friendsService.findRequests(4); // change the id value to the logged in user id
  }

  // Send a friend request
  @Post('')
  sendFriendRequest(@Body() request: FriendRequestDto) {
    return this.friendsService.sendFriendRequest(request);
  }

  // Accept A friend request
  @Patch(':id')
  acceptFriendRequest(@Param('id') id: string) {
    return this.friendsService.acceptFriendRequest(+id);
  }

  @Delete(':id')
  declineFriendRequest(@Param('id') id: string) {
    return this.friendsService.declineFriendRequest(+id);
  }
}
