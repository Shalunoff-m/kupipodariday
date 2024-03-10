import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepo: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async createWish(createWishDto: CreateWishDto, username: string) {
    const user = await this.usersService.getUserByUsername(username);
    const wish = this.wishRepo.create(createWishDto);
    wish.owner = user;
    return this.wishRepo.save(wish);
  }

  async getLastWishes() {
    return this.wishRepo.find({ order: { createdAt: 'desc' }, take: 40 });
  }

  async getTopWishes() {
    return this.wishRepo.find({ order: { copied: 'desc' }, take: 10 });
  }

  async getWishById(id: number, relations = null) {
    const wish = this.wishRepo.findOne({ where: { id }, relations });
    if (!wish) {
      throw new NotFoundException();
    }
    return wish;
  }

  async deleteWishById(id: number, currentUser) {
    const wish = await this.wishRepo.findOneBy({ id });
    if (!wish) {
      throw new NotFoundException();
    }
    if (wish.owner !== currentUser.id) {
      throw new ForbiddenException();
    }
    return this.wishRepo.delete({ id });
  }

  async findWishesById(idArr: any) {
    const wishes = await this.wishRepo.find({
      where: { id: In(idArr) },
    });
    return wishes;
  }

  async copyWish(id: number, currentUser) {
    const wish = await this.getWishById(id, ['owner']);
    const wishCopy = {
      name: wish.name,
      image: wish.image,
      link: wish.link,
      price: wish.price,
      description: wish.description,
    };
    const hasWish = await this.wishRepo.find({
      where: {
        owner: { _id: currentUser.id },
      },
    });

    if (hasWish) {
      throw new ConflictException();
    }

    await this.createWish(wishCopy, currentUser.username);
    return this.wishRepo.update(id, {
      copied: wish.copied + 1,
    });
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepo.update(id, updateWishDto);
  }
}
