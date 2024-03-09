import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(getUsername: string, getPassword: string) {
    console.log(getUsername, getPassword);
    const user = await this.authService.validateUser(getUsername, getPassword);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
