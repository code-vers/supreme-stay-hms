import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthDao {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  register(createAuthDto) {
    return createAuthDto;
  }
}
