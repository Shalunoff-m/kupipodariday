import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    @InjectRepository(Wishlist) private wishlistsRepo: Repository<Wishlist>,
  ) {}

  async findAllWishlists() {
    return this.wishlistsRepo.find({ relations: ['owner', 'items'] });
  }

  async findWishlistById(id: number) {
    const wishlist = await this.wishlistsRepo.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new NotFoundException('Такого списка желаний не существует');
    }
    return wishlist;
  }

  async createWishlist(createWishListDto: CreateWishlistDto, currentUser) {
    const { itemsId, ...collectionData } = createWishListDto;
    const wishes = await this.wishesService.findManyById(itemsId);
    const user = await this.usersService.findUserById(currentUser.id);

    return await this.wishlistsRepo.save({
      ...collectionData,
      owner: user,
      items: wishes,
    });
  }

  async deleteWishlistById(id: number) {
    return this.wishlistsRepo.delete(id);
  }
}
