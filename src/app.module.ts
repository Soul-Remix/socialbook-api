import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';

@Module({
  imports: [UsersModule, FriendsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
