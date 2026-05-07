import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

export enum OwnerApprovalStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column({ nullable: true })
  firstName!: string;

  @Column({ nullable: true })
  lastName!: string;

  @ManyToOne(() => Role, { nullable: true, eager: true })
  @JoinColumn({ name: 'role' })
  role!: Role;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({
    type: 'enum',
    enum: OwnerApprovalStatus,
    default: OwnerApprovalStatus.NOT_REQUIRED,
  })
  ownerApprovalStatus!: OwnerApprovalStatus;

  @Column({ type: 'text', nullable: true })
  nidNumber?: string;

  @Column({ type: 'text', nullable: true })
  tradeLicenseNumber?: string;

  @Column({ type: 'text', nullable: true })
  businessName?: string;

  @Column({ type: 'text', nullable: true })
  propertyName?: string;

  @Column({ type: 'text', nullable: true })
  ownerDocumentImageUrl?: string;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
