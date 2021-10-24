import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        userId,
        postId: createCommentDto.postId,
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.validComment(id);
    return this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        ...updateCommentDto,
      },
    });
  }

  async remove(id: number) {
    await this.validComment(id);
    return this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }

  findUserComments(id: number) {
    return this.prisma.comment.findMany({
      where: {
        userId: id,
      },
    });
  }

  async validComment(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return comment;
  }
}
