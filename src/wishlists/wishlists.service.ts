import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
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

  async getAll() {
    return this.wishlistsRepo.find({ relations: ['owner', 'items'] });
  }

  async getById(id: number) {
    const wishList = await this.wishlistsRepo.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    return wishList;
  }

  async create(createWishListDto: CreateWishlistDto, currentUser) {
    const { itemsId, ...collectionData } = createWishListDto;
    const wishes = await this.wishesService.findWishesById(itemsId);
    const user = await this.usersService.getUserById(currentUser.id);

    return await this.wishlistsRepo.save({
      ...collectionData,
      owner: user,
      items: wishes,
    });
  }

  async deleteById(id: number) {
    return this.wishlistsRepo.delete(id);
  }
}
