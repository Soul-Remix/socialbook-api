import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, FriendRequests } from '@prisma/client';
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

  async findFriends(id: number) {
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: { friends: true },
    });
    // throw error if a user was not found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.friends) {
      return [];
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

  async sendFriendRequest(request: {
    sender: number;
    receiver: number;
  }): Promise<FriendRequests> {
    const { sender, receiver } = request;
    // search for a user with the same id
    const user = await this.prisma.user.findUnique({
      where: {
        id: receiver,
      },
    });
    // throw error if a user was Not found
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // send the friend request
    return this.prisma.friendRequests.create({
      data: {
        sender,
        receiver,
      },
    });
  }

  async acceptFriendRequest(id: number): Promise<FriendRequests> {
    // Search for a request with the same id
    const request = await this.prisma.friendRequests.findUnique({
      where: {
        id,
      },
    });
    // throw error if a user was found
    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }

    const [, , , accept] = await Promise.all([
      // Create a Conversation & connect the two users
      this.prisma.conversation.create({
        data: {
          members: {
            connect: [{ id: request.receiver }, { id: request.sender }],
          },
        },
      }),
      // Add the friend to the user friends list
      this.prisma.friendsList.update({
        where: {
          userId: request.sender,
        },
        data: {
          friends: {
            push: request.receiver,
          },
        },
      }),
      // Add the friend to the second user friends list
      this.prisma.friendsList.update({
        where: {
          userId: request.receiver,
        },
        data: {
          friends: {
            push: request.sender,
          },
        },
      }),
      // Delete the friend request
      this.prisma.friendRequests.delete({
        where: {
          id,
        },
      }),
    ]);
    return accept;
  }

  async declineFriendRequest(id: number): Promise<FriendRequests> {
    // Search for a request with the same id
    const request = await this.prisma.friendRequests.findUnique({
      where: {
        id,
      },
    });
    // throw error if a user was found
    if (!request) {
      throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
    }
    // Delete the friend request
    return this.prisma.friendRequests.delete({
      where: {
        id,
      },
    });
  }
}
