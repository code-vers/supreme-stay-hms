import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { UserRole } from 'src/common/enum/user.role.enun';

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
