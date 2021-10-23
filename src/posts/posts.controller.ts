import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Create Post
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  // Update Post
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  // Delete Post
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  // Get All Posts
  @Get()
  findAll(@Query('cursor') cursor?: number) {
    // change cursor type to number if it's string
    if (typeof cursor === 'string' && typeof cursor !== undefined) {
      cursor = +cursor;
    }
    return this.postsService.findAll(cursor);
  }

  // Get Users Posts
  @Get('personal')
  @UseGuards(JwtAuthGuard)
  findPersonal(@Request() req: any) {
    return this.postsService.findPersonal(req.user.id);
  }

  // Get feed posts
  @Get('feed')
  @UseGuards(JwtAuthGuard)
  findFeed(@Request() req: any, @Query('cursor') cursor?: number) {
    // change cursor type to number if it's string
    if (typeof cursor === 'string' && typeof cursor !== undefined) {
      cursor = +cursor;
    }
    return this.postsService.findFeed(req.user.id, cursor);
  }

  // Find One Post
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }
}
