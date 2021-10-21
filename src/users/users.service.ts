import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (foundUser) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }
    const hash = await bcrypt.hash(password, 12);
    return this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hash,
        extendedProfile: {
          create: {},
        },
      },
    });
  }
}
