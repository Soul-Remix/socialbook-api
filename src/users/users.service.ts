import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
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
    const createdUser = await this.prisma.user.create({
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
    return { message: 'User Created Successfully', id: createdUser.id };
  }

  async findAll(cursor: number | undefined) {
    // return a list with all the users
    let nextCursor: number | undefined;
    let hasNextPage = false;
    let users;
    // If cursor is not defined
    if (cursor === undefined) {
      users = await this.prisma.user.findMany({
        take: 20,
        orderBy: {
          extendedProfile: {
            createdAt: 'desc',
          },
        },
      });
      // If cursor is Defined
    } else {
      users = await this.prisma.user.findMany({
        take: 20,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          extendedProfile: {
            createdAt: 'desc',
          },
        },
      });
    }
    // Check if there's more users
    if (users && users.length === 20) {
      nextCursor = users[19].id;
      hasNextPage = true;
    }
    return { users, hasNextPage, nextCursor };
  }

  async findOne(id: number) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // search if there's a user with this id
    await this.validUser(id);
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 12);
      updateUserDto.password = hash;
    }
    // update the user
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
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

  async remove(id: number) {
    // search if there's a user with this id
    await this.validUser(id);

    await Promise.all([
      // delete any friends requests sent or received by the user
      this.prisma.friendRequests.deleteMany({
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
      }),
      // delete the user
      this.prisma.user.delete({
        where: {
          id,
        },
      }),
    ]);
    return { message: 'User Deleted Successfully' };
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

  async validUser(id: number) {
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
    return user;
  }
}
