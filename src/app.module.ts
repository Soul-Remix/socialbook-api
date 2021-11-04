import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ConversationsModule } from './conversations/conversations.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    UsersModule,
    FriendsModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    ConversationsModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
