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
import { JwtGuard } from 'src/auth/jwt.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Get('me')
  async getUser(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getByUserName(@Param('username') userName: string) {
    return await this.usersService.findOneByUsername(userName);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserdto: UpdateUserDto) {
    return await this.usersService.updateUser(req.id, updateUserdto);
  }

  @Post('find')
  async searchForUser(@Body() searchQuery: any) {
    const result = await this.usersService.searchForUser(searchQuery.query);
    return result;
  }

  @Get(':username/wishes')
  async getUserWishs(@Param('username') username: string) {
    const result = await this.usersService.getActiveUserWishes(username);
    return result;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getActiveUserWishes(@Req() req) {
    const result = await this.usersService.getActiveUserWishes(
      req.user.username,
    );
    return result;
  }
}
