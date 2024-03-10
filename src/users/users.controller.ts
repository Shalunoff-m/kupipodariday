import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() req) {
    return await this.usersService.getUserById(req.user.id);
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return await this.usersService.getUserByUsername(username);
  }

  @Get('me/wishes')
  async getActiveUserWishes(@Req() req) {
    const result = await this.usersService.getUserById(req.user.id, ['wishes']);
    return result.wishes;
  }

  @Get(':username/wishes')
  async getUserWishs(@Param('username') username: string) {
    const result = await this.usersService.getUserByUsername(username, [
      'wishes',
    ]);

    return result.wishes;
  }

  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserdto: UpdateUserDto) {
    return await this.usersService.updateUser(req.user.id, updateUserdto);
  }

  @Post('find')
  async searchForUser(@Body() searchQuery: any) {
    const result = await this.usersService.searchForUsers(searchQuery.query);
    return result;
  }
}
