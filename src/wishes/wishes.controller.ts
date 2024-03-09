import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return await this.wishesService.createWish(createWishDto, req.user);
  }

  @Get('/last')
  async getLastWishes() {
    return await this.wishesService.getLastWishes();
  }

  @Get('/top')
  async getTopWishes() {
    return await this.wishesService.getLastWishes();
  }

  @Get(':id')
  async getWishById(@Param('id') id: number) {
    return await this.wishesService.getWishById(id);
  }

  @Delete(':id')
  async deleteWishById(@Param('id') id: number) {
    return await this.wishesService.deleteWishById(id);
  }
}
