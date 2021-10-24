import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsersDto } from './dto/search-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a user
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Return a list of all users
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('cursor') cursor?: number) {
    if (typeof cursor === 'string' && typeof cursor !== undefined) {
      cursor = +cursor;
    }
    return this.usersService.findAll(cursor);
  }

  // Find a user by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // Update a user settings
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // Update a user profile
  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Param('id') id: string,
    @Body() UpdateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(+id, UpdateProfileDto);
  }

  // Delete a user
  // needs to be updated to remove the deleted user id from other users friends list
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // Search for a user
  @Post('search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Body() search: SearchUsersDto) {
    return this.usersService.searchUsers(search.search);
  }
}
