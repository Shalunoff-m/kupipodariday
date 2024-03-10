import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getActiveUser(@Req() req) {
    return await this.usersService.findUserById(req.user.id);
  }

  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserdto: UpdateUserDto) {
    return await this.usersService.updateUserById(req.user.id, updateUserdto);
  }

  @Get('me/wishes')
  async getActiveUserWishes(@Req() req) {
    return await (
      await this.usersService.findUserById(req.user.id, ['wishes'])
    ).wishes;
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return await this.usersService.findUserByUsername(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return await this.usersService.findUserByUsername(username, ['wishes']);
  }

  @Post('find')
  async getUsers(@Body() searchQuery: any) {
    return await this.usersService.findUsersByQuery(searchQuery.query);
  }
}
