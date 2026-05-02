import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { array: true, nullable: true })
  resource!: string[];

  @Column('text', { array: true, nullable: true })
  action!: string[];
}
