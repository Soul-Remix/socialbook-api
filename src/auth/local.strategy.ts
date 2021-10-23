import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validate } from 'class-validator';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'pass' });
  }

  async validate(email: string, pass: string): Promise<any> {
    const data = new SignInDto();
    data.email = email;
    data.pass = pass;
    const errors = await validate(data);
    if (errors.length > 0) {
      const obj = errors[0].constraints;
      if (obj) {
        const msg: string = obj[Object.keys(obj)[0]];
        throw new HttpException(msg, HttpStatus.CONFLICT);
      }
    } else {
      const user = await this.authService.validateUser(email, pass);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
  }
}
