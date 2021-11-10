import { User } from '.prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      throw new HttpException(
        'Wrong Credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      throw new HttpException(
        'Wrong Credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    const friendReq = await this.prisma.friendRequests.findMany({
      where: {
        receiver: user.id,
        accepted: false,
      },
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, friendReq: friendReq.length },
    };
  }
}
