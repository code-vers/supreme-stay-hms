import {
  ActionType,
  PermissionScope,
  ResourceType,
} from 'src/common/enum/user.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('permissions')
@Unique(['resource', 'action', 'scope']) // prevents duplicates
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: ResourceType })
  resource!: ResourceType;

  @Column({ type: 'enum', enum: ActionType })
  action!: ActionType;

  @Column({
    type: 'enum',
    enum: PermissionScope,
    default: PermissionScope.PROPERTY,
  })
  scope!: PermissionScope;

  @Column({ nullable: true })
  description?: string;
}
