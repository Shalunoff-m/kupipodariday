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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists() {
    return await this.wishlistsService.getAll();
  }

  @Get(':id')
  async getWishList(@Param('id') id: number) {
    return await this.wishlistsService.getById(id);
  }

  @Post()
  async createWishList(
    @Body() createWishListDto: CreateWishlistDto,
    @Req() req,
  ) {
    return await this.wishlistsService.create(createWishListDto, req.user);
  }

  @Delete(':id')
  async deleteWishList(@Param('id') id: number) {
    return await this.wishlistsService.deleteById(id);
  }
}
