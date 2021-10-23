import { Post } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Post
  async create(data: CreatePostDto, id: number): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...data,
        author: { connect: { id } },
      },
    });
  }

  // Update Post
  async update(id: number, data: UpdatePostDto) {
    // Check if there's a posts with this id
    await this.CheckPostID(id);
    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  // Delete a post
  async remove(id: number) {
    // Check if there's a posts with this id
    await this.CheckPostID(id);
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }

  // find a post by id
  async findOne(id: number) {
    await this.CheckPostID(id);
  }

  // Get Personal Posts
  async findPersonal(id: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: id,
      },
    });
  }

  // Get All Posts (Paginated)
  async findAll(cursor: number | undefined) {
    let nextCursor: number | undefined;
    let hasNextPage = false;
    let posts;
    // If cursor is not defined
    if (cursor === undefined) {
      posts = await this.prisma.post.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      // If cursor is Defined
    } else {
      posts = await this.prisma.post.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    // Check if there's more Posts
    if (posts && posts.length === 10) {
      nextCursor = posts[9].id;
      hasNextPage = true;
    }
    return { posts, hasNextPage, nextCursor };
  }

  // Get Posts Posted by the user or shared by his friends
  async findFeed(id: number, cursor: number | undefined) {
    // return the user list of friends
    const friendsList = await this.prisma.friendsList.findUnique({
      where: {
        userId: id,
      },
    });
    let nextCursor: number | undefined;
    let hasNextPage = false;
    let posts;
    if (cursor === undefined) {
      posts = await this.prisma.post.findMany({
        take: 10,
        where: {
          OR: [
            { authorId: id },
            {
              author: {
                id: {
                  in: friendsList?.friends,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      posts = await this.prisma.post.findMany({
        take: 10,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          OR: [
            { authorId: id },
            {
              author: {
                id: {
                  in: friendsList?.friends,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    if (posts && posts.length === 10) {
      nextCursor = posts[9].id;
      hasNextPage = true;
    }
    return { posts, nextCursor, hasNextPage };
  }

  // Helper Func to check if there's a post with the provided id
  async CheckPostID(id: number) {
    const post = this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }
}
