import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @Get()
  async getAllOffers() {
    return await this.offersService.findAllOffers();
  }

  @Get(':id')
  async getOffer(@Body('id') id: number) {
    return await this.offersService.findOfferById(id);
  }

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Req() currentUser,
  ) {
    return await this.offersService.createOffer(currentUser.user, {
      ...createOfferDto,
      hidden: false,
    });
  }
}
