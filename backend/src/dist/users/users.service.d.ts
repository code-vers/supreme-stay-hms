import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOneByEmail(email: string): Promise<User | null>;
    findOneById(id: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    findOneByRefreshToken(refreshToken: string): Promise<User | null>;
    update(userId: string, data: Partial<User>): Promise<User | null>;
}
