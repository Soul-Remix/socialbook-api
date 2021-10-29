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
import { SearchPostsDto } from './dto/search-posts.dto';

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
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  // Delete Post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  // add a Like to a Post
  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  addLike(@Request() req: any, @Param('id') id: string) {
    return this.postsService.addLike(+id, req.user.id);
  }

  // remove a Like to a Post
  @Delete(':id/likes')
  @UseGuards(JwtAuthGuard)
  removeLike(@Request() req: any, @Param('id') id: string) {
    return this.postsService.removeLike(+id, req.user.id);
  }

  // Get All Posts
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('cursor') cursor?: number) {
    // change cursor type to number if it's string
    if (typeof cursor === 'string' && typeof cursor !== undefined) {
      cursor = +cursor;
    }
    return this.postsService.findAll(cursor);
  }

  // Get User Posts
  @Get('personal/:id')
  @UseGuards(JwtAuthGuard)
  findPersonal(@Param('id') id: string) {
    return this.postsService.findPersonal(+id);
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

  // Search Posts
  @Post('search')
  @UseGuards(JwtAuthGuard)
  search(@Body('search') search: SearchPostsDto) {
    console.log(search);
    return this.postsService.search(search);
  }

  // Find One Post
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }
}
