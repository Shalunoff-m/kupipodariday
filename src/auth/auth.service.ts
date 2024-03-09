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
    const user = await this.usersService.findOne(getName);
    // Выход, если пользователь не найден или пароль не совпадает
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(getPassword, user.password);
    if (!isMatch) {
      return null;
    }

    // Используем деструктуризацию, чтобы исключить пароль из возвращаемого объекта
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async auth(user: User) {
    const payload = { ...user, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
