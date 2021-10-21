import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-user.dto';
import { FriendRequestDto } from './dto/friend-request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a user
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Return a list of all users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Find a user by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // Update a user settings
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // Delete a user
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Return a list off all the user friends
  @Get(':id/friends')
  findFriends(@Param('id') id: string) {
    return this.usersService.findFriends(+id);
  }

  // Send a friend request
  @Post('friends')
  sendFriendRequest(@Body() request: FriendRequestDto) {
    return this.usersService.sendFriendRequest(request);
  }

  // Accept A friend request
  @Patch('friends/:id')
  acceptFriendRequest(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.acceptFriendRequest(+id);
  }

  // Search for a user
  @Post('search')
  searchUsers(@Body() search: SearchUsersDto) {
    return this.usersService.searchUsers(search.search);
  }
}
