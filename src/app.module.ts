import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UsersModule, FriendsModule, AuthModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
