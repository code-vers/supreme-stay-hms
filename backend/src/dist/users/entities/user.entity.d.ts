import { Role } from '../../roles/entities/role.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    status: boolean;
    imageUrl?: string;
    phoneNumber?: string;
    address?: string;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}
