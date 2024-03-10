import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hash,
      });

      return await this.userRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Электронная почта уже испольуется');
      }
    }
  }

  async findUserById(id: number, relations = null) {
    const user = await this.userRepository.findOne({
      where: { _id: id },
      relations,
    });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  async findUserByUsername(username: string, relations = null) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations,
    });
    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userRepository.update(user, updateUserDto);
  }

  async findUsersByQuery(query: string) {
    const searchQuery = query.includes('@')
      ? { email: query }
      : { username: query };

    const user = await this.userRepository.find({
      where: searchQuery,
    });

    if (!user) {
      throw new NotFoundException('Такого пользователя не существует');
    }
    return user;
  }
}
