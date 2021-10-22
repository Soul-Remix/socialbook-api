import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;
    // search for a user with the same email
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    // throw error if a user was not found
    if (foundUser) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }
    //hash the password
    const hash = await bcrypt.hash(password, 12);
    //create the user
    return this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
        extendedProfile: {
          create: {},
        },
        friends: {
          create: {},
        },
      },
    });
  }

  async findAll(): Promise<User[]> {
    // return a list with all the users
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: { extendedProfile: true },
    });
    // throw error if a user was not found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // return the user
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    // throw error if a user was not found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // hash the password if changed
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 12);
      updateUserDto.password = hash;
    }
    // update the user
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
  }

  async updateProfile(id: number, data: UpdateProfileDto) {
    // search for a profile with the same id
    const profile = await this.prisma.extendedProfile.findUnique({
      where: {
        id,
      },
    });
    // throw error if a profile was not found
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.extendedProfile.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async remove(id: number): Promise<User> {
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    // throw error if a user was not found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // delete any friends requests sent or received by the user
    await this.prisma.friendRequests.deleteMany({
      where: {
        OR: [
          {
            sender: id,
          },
          {
            receiver: id,
          },
        ],
      },
    });
    // delete the user
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async searchUsers(search: string) {
    // search for users that contain the search string in first name or last name
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
    });
  }
}
