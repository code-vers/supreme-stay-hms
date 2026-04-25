import { UserStatus } from 'src/common/enum/user.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  first_name!: string;

  @Column({ nullable: false })
  last_name!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false })
  image!: string;

  @Column()
  address!: string;

  @Column()
  phone!: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  // @ManyToOne(() => Role, (role) => role.users)
  // role_id!: string;
}
