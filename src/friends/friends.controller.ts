import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  // Return a list off all the user friends
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findFriends(@Param('id') id: string) {
    return this.friendsService.findFriends(+id);
  }

  @Get()
  // Return a list off friends requests received by the user
  @UseGuards(JwtAuthGuard)
  findRequests(@Request() req: any) {
    return this.friendsService.findRequests(req.user.id);
  }

  // Send a friend request
  @Post()
  @UseGuards(JwtAuthGuard)
  sendFriendRequest(@Body() request: FriendRequestDto) {
    return this.friendsService.sendFriendRequest(request);
  }

  // Accept A friend request
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  acceptFriendRequest(@Param('id') id: string) {
    return this.friendsService.acceptFriendRequest(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  declineFriendRequest(@Param('id') id: string) {
    return this.friendsService.declineFriendRequest(+id);
  }
}
