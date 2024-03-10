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
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getAllOffers() {
    return await this.offersService.getAll();
  }

  @Get(':id')
  async getOfferById(@Body('id') id: number) {
    return await this.offersService.getById(id);
  }

  @Post()
  async createOffer(@Body() createOfferDto: any, @Req() currentUser) {
    return await this.offersService.create(currentUser.user, createOfferDto);
  }
}
