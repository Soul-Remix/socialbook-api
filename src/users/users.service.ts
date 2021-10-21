import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, FriendsList } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
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
    // throw error if a user was found
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
    });
    // throw error if a user was found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // return the user
    return user;
  }

  async findFriends(id: number) {
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: { friends: true },
    });
    // throw error if a user was found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // return the friends list
    return this.prisma.user.findMany({
      where: {
        id: {
          in: user.friends.friends,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    // throw error if a user was found
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

  remove(id: number): Promise<User> {
    // search for a user with the same id
    const user = this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    // throw error if a user was found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
