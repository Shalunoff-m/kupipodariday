import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(getName: string, getPassword: string) {
    const user = await this.usersService.findUserByUsername(getName);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(getPassword, user.password);

    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { ...user, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
