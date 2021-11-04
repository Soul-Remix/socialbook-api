import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Message
  async create(createMessageDto: CreateMessageDto, senderId: number) {
    const data = { ...createMessageDto };
    return this.prisma.message.create({
      data: {
        text: data.text,
        senderId,
        Conversation: { connect: { id: data.conversationId } },
      },
    });
  }

  // Get User Conversations
  async findAllUserConversation(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        conversation: {
          include: {
            members: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePicture: true,
                isOnline: true,
                sId: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const conversation = user.conversation;
    return conversation;
  }

  // Find Conversation by id
  async findOne(id: number) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    if (!conv) {
      throw new HttpException('Conversation Not Found', HttpStatus.NOT_FOUND);
    }
    return conv;
  }
}
