import { Post } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const include = {
  comments: true,
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profilePicture: true,
    },
  },
};

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
      include: include,
    });
  }

  // Update Post
  async update(id: number, data: UpdatePostDto) {
    // Check if there's a posts with this id
    await this.checkPostId(id);
    return this.prisma.post.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
      include: include,
    });
  }

  // Delete a post
  async remove(id: number) {
    // Check if there's a posts with this id
    await this.checkPostId(id);
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }

  // Add a like to a post
  async addLike(postId: number, userId: number) {
    const post = await this.checkPostId(postId);
    let alreadyLiked = post.Likes.includes(userId);
    if (alreadyLiked) {
      throw new HttpException(
        'You already liked this post',
        HttpStatus.CONFLICT,
      );
    }
    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        Likes: { push: userId },
      },
    });
    return { message: 'Post liked successfuly' };
  }

  // remove a like from a post
  async removeLike(postId: number, userId: number) {
    const post = await this.checkPostId(postId);
    let alreadyLiked = post.Likes.includes(userId);
    if (!alreadyLiked) {
      throw new HttpException(
        'You already removed your like from this post',
        HttpStatus.CONFLICT,
      );
    }
    const newLikes = post.Likes.filter((x) => x !== userId);
    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        Likes: newLikes,
      },
    });
    return { message: 'Removed like successfully' };
  }

  // find a post by id
  async findOne(id: number) {
    const post = await this.checkPostId(id);
    return post;
  }

  // Get Personal Posts
  async findPersonal(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.post.findMany({
      where: {
        authorId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: include,
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
        include: include,
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
        include: include,
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
        include: include,
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
        include: include,
      });
    }
    if (posts && posts.length === 10) {
      nextCursor = posts[9].id;
      hasNextPage = true;
    }
    return { posts, nextCursor, hasNextPage };
  }

  // Search Posts
  async search(text: any): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: {
        content: {
          contains: text,
          mode: 'insensitive',
        },
      },
      include: include,
    });
  }

  // Helper Func to check if there's a post with the provided id
  async checkPostId(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: include,
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }
}
