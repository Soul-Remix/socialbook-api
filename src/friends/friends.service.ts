import { FriendRequests } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}
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

  async findRequests(id: number) {
    return this.prisma.friendRequests.findMany({
      where: {
        receiver: id,
        accepted: false,
      },
    });
  }

  async sendFriendRequest(request: {
    sender: number;
    receiver: number;
  }): Promise<FriendRequests> {
    const { sender, receiver } = request;
    // search for a user with the same id
    const [userR, userS] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: receiver,
        },
      }),
      this.prisma.user.findUnique({
        where: {
          id: sender,
        },
      }),
    ]);
    // throw error if a user was Not found
    if (!userR || !userS) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Search if a request was already sent
    const foundRequest = await this.prisma.friendRequests.findMany({
      where: {
        AND: [
          {
            sender: {
              in: [sender, receiver],
            },
          },
          {
            receiver: {
              in: [sender, receiver],
            },
          },
        ],
      },
    });
    // If A request was found throw an error
    if (foundRequest.length > 0) {
      throw new HttpException(
        'A request was already sent',
        HttpStatus.CONFLICT,
      );
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
    const { sender, receiver } = request;
    const [c, s, r, accept] = await Promise.all([
      // Create a Conversation & connect the two users
      this.prisma.conversation.create({
        data: {
          members: {
            connect: [{ id: receiver }, { id: sender }],
          },
        },
      }),
      // Add the friend to the user friends list
      this.prisma.friendsList.update({
        where: {
          userId: sender,
        },
        data: {
          friends: {
            push: receiver,
          },
        },
      }),
      // Add the friend to the second user friends list
      this.prisma.friendsList.update({
        where: {
          userId: receiver,
        },
        data: {
          friends: {
            push: sender,
          },
        },
      }),
      // Update the friend request
      this.prisma.friendRequests.update({
        where: {
          id,
        },
        data: {
          accepted: true,
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
