import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepo: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async getAll() {
    return this.offerRepo.find({
      where: {},
      relations: { user: true, item: true },
    });
  }

  async getById(id: number) {
    return this.offerRepo.findOneBy({ id });
  }

  async create(user: any, createOfferDto: any) {
    const wish = await this.wishesService.getWishById(createOfferDto.itemId, [
      'owner',
    ]);

    if (user.id === wish.owner._id) {
      throw new ForbiddenException();
    }
    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new ForbiddenException();
    }

    wish.raised += createOfferDto.amount;

    const offer = this.offerRepo.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    await this.wishesService.updateWish(wish.id, wish);

    return this.offerRepo.save(offer);
  }
}
