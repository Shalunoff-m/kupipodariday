import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepo: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async findAllOffers() {
    return this.offerRepo.find({
      where: {},
      relations: { user: true, item: true },
    });
  }

  async findOfferById(id: number) {
    return this.offerRepo.findOneBy({ id });
  }

  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findWishById(createOfferDto.itemId, [
      'owner',
    ]);

    if (user._id === wish.owner._id) {
      throw new ForbiddenException('Вы не можете поддержать свой подарок');
    }
    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new ForbiddenException(
        'Вы не можете внести сумму больше стоимости подарка',
      );
    }

    wish.raised += createOfferDto.amount;

    const offer = this.offerRepo.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });

    await this.wishesService.updateRaisedWishById(user._id, wish.id, wish);
    return this.offerRepo.save(offer);
  }
}
