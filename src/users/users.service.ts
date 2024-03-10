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
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Электронная почта уже используется');
    }

    const hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });
    // TODO Вернуть потом всё обратно

    return this.userRepository.save(user);
  }

  async findUserById(id: number, relations = null) {
    const user = await this.userRepository.findOne({
      where: { id },
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

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailAlreadyExist = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (emailAlreadyExist) {
        throw new ConflictException('Электронная почта уже используется');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.update(id, updateUserDto);
  }

  async findUsersByQuery(query: string) {
    const searchQuery = query.includes('@')
      ? { email: query }
      : { username: query };

    return this.userRepository.find({ where: searchQuery });
  }
}
