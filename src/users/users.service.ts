import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByUsername(getName: string) {
    return await this.userRepository.findOne({ where: { username: getName } });
  }

  async updateUser(_id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ _id });
    const updatedUser = updateUserDto;

    if (updatedUser.password) {
      updatedUser.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.update(user, updatedUser);
  }

  async searchForUser(query: string) {
    const user = await this.userRepository.find({
      where: { username: query },
    });
    return user;
  }

  async getActiveUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    return user.wishes;
  }

  async getUserWishs(username: string) {
    const user = await this.userRepository.find({
      where: { username },
      relations: ['wishes'],
    });
    return user;
  }
}
