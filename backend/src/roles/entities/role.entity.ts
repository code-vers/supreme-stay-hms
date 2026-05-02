import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PROPERTY_OWNER = 'PROPERTY_OWNER',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  FRONT_DESK_MANAGER = 'FRONT_DESK_MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  HOUSEKEEPING_MANAGER = 'HOUSEKEEPING_MANAGER',
  HOUSEKEEPING_STAFF = 'HOUSEKEEPING_STAFF',
  ACCOUNTANT = 'ACCOUNTANT',
  POS_MANAGER = 'POS_MANAGER',
  MAINTENANCE_STAFF = 'MAINTENANCE_STAFF',
  HR_MANAGER = 'HR_MANAGER',
  GUEST_USER = 'GUEST_USER',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  name!: UserRole;

  @ManyToOne(() => Permission, { nullable: true, eager: true })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;
}
