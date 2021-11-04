import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma.service';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(
    private readonly socketService: SocketService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: any, ...args: any[]) {
    const userId = client.handshake.headers.user;
    if (userId && typeof userId === 'string') {
      await this.prisma.user.update({
        where: {
          id: +userId,
        },
        data: {
          isOnline: true,
          sId: client.id,
        },
      });
    }
  }

  async handleDisconnect(client: any) {
    const userId = client.handshake.headers.user;
    if (userId && typeof userId === 'string') {
      await this.prisma.user.update({
        where: {
          id: +userId,
        },
        data: {
          isOnline: false,
          sId: null,
        },
      });
    }
  }

  @SubscribeMessage('msgToServer')
  handleEvent(client: Socket, data: any): void {
    console.log(data);
    client.to(data.socketId).emit('message', data);
  }
}
