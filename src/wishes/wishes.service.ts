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
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepo: Repository<Wish>,
    private usersService: UsersService,
  ) {}

  async createWish(createWishDto: CreateWishDto, username: string) {
    const user = await this.usersService.findUserByUsername(username);
    const wish = this.wishRepo.create({ ...createWishDto, owner: user });
    return this.wishRepo.save(wish);
  }

  async showLastWish() {
    return this.wishRepo.find({ order: { createdAt: 'DESC' }, take: 40 });
  }

  async showTopWish() {
    return this.wishRepo.find({ order: { copied: 'DESC' }, take: 10 });
  }

  async findWishById(id: number, relations: string[] = []) {
    const wish = await this.wishRepo.findOne({ where: { id }, relations });
    if (!wish) {
      throw new NotFoundException('Такого подарка не существует');
    }
    return wish;
  }

  async deleteById(id: number, currentUser) {
    const wish = await this.findWishById(id);

    if (wish.owner !== currentUser.id) {
      throw new ForbiddenException('Вы не можете удалить чужой подарок');
    }
    return this.wishRepo.delete({ id });
  }

  async findManyById(ids: number[]) {
    return this.wishRepo.findBy({ id: In(ids) });
  }

  async copyWish(id: number, currentUser: User) {
    const wish = await this.findWishById(id, ['owner']);

    if (wish.owner._id === currentUser._id) {
      throw new ConflictException('Вы уже добавили себе этот подарок');
    }

    const newWish = { ...wish, copied: wish.copied + 1 };
    await this.createWish(newWish, currentUser.username);
    return this.wishRepo.save(newWish);
  }

  async updateWishById(
    userId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.findWishById(id, ['owner']);
    if (userId !== wish.owner._id) {
      throw new ForbiddenException('Вы не можете изменить чужой подарок');
    }
    if (wish.raised !== 0) {
      throw new ConflictException(
        'Вы не можете изменить стоимость подарка, если уже есть желающие его поддержать',
      );
    }
    return await this.wishRepo.update(id, updateWishDto);
  }

  async updateRaisedWishById(id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepo.update(id, updateWishDto);
  }
}
