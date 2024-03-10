import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async createWish(@Body() createWishDto: CreateWishDto, @Req() req) {
    return await this.wishesService.createWish(
      createWishDto,
      req.user.username,
    );
  }

  @Get('/last')
  async getLastWishes() {
    return await this.wishesService.showLastWish();
  }

  @Get('/top')
  async getTopWishes() {
    return await this.wishesService.showTopWish();
  }

  @Get(':id')
  async getWish(@Param('id') id: number) {
    return await this.wishesService.findWishById(id, ['owner', 'offers']);
  }

  @Patch(':id')
  async updateById(
    @Req() req,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.updateWishById(
      req.user.id,
      id,
      updateWishDto,
    );
  }

  @Delete(':id')
  async deleteWish(@Param('id') id: number, @Req() currentUser) {
    return await this.wishesService.deleteById(id, currentUser);
  }

  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @Req() req) {
    return await this.wishesService.copyWish(id, req.user);
  }
}
