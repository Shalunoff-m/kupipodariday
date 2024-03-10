import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(getName: string, getPassword: string) {
    const findUser = await this.usersService.getUserByUsername(getName);

    if (!findUser) return null;

    const isMatch = await bcrypt.compare(getPassword, findUser.password);
    if (!isMatch) return null;

    const { password, ...userWithoutPassword } = findUser;
    return userWithoutPassword;
  }

  async auth(user: User) {
    const payload = { ...user, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
