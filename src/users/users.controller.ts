import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getUser(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async getByUserName(@Param('username') userName: string) {
    return await this.usersService.findOneByUsername(userName);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateUser(@Req() req, @Body() updateUserdto: UpdateUserDto) {
    return await this.usersService.updateUser(req.id, updateUserdto);
  }
}
