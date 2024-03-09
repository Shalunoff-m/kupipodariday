import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalGuard } from './local.guards';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return await this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signIn')
  async signIn(@Req() req) {
    return this.authService.auth(req.user);
  }
}
