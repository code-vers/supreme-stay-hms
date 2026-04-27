import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { createUserDto } from './dto/create-auth.dto';

@Injectable()
export class AuthDao {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async register(createUserDto: createUserDto) {
    const user = this.repo.create(createUserDto); // entity create
    return await this.repo.save(user); // DB te save
  }
}
