import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalGuard } from './local.guards';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signIn')
  async signIn(@Req() req) {
    return this.authService.auth(req.user);
  }

  @Post('signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return await this.authService.auth(user);
  }
}
