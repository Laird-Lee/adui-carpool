import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      username: createUserDto.username,
      email: createUserDto.email,
    });
    if (user) {
      throw new InternalServerErrorException();
    }
    const userTmp = this.userRepository.create({ ...createUserDto });
    userTmp.password = await argon2.hash(userTmp.password);
    return await this.userRepository.save(userTmp);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findByAccount(account: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :account', { account })
      .orWhere('user.email = :account', { account })
      .orWhere('user.phone = :account', { account })
      .getOne();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
