import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

export enum RestaurantTableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ type: 'int' })
  table_number: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'enum', enum: RestaurantTableStatus })
  status: RestaurantTableStatus;
}
