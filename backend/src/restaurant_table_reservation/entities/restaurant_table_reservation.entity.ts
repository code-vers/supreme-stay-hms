// src/reservation/entities/reservation.entity.ts
import { RestaurantTable } from 'src/restaurant-table/entities/restaurant-table.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderType {
  DINE_IN = 'dine_in',
  TAKEAWAY = 'takeaway',
  ROOM_SERVICE = 'room_service',
}

export enum ReservationStatus {
  PENDING = 'pending',
  COOKING = 'cooking',
  SERVED = 'served',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('restaurant_table_reservation')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @Column({ type: 'uuid' })
  table_id: string;

  @Column({ type: 'enum', enum: OrderType })
  order_type: OrderType;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'int' })
  total_amount: number;

  @Column({ type: 'int', nullable: true })
  discount: number;

  @Column({ type: 'int' })
  grand_total: number;

  @Column()
  order_by: string; // customer name / order taker name

  @Column({ type: 'timestamp' })
  reservation_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_in_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  check_out_time: Date;

  @Column({ type: 'int', default: 120 })
  booking_duration_minutes: number;

  @Column({ nullable: true })
  special_request: string;

  @Column({ type: 'int', default: 1 })
  guest_count: number;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => RestaurantTable, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'table_id' })
  table: RestaurantTable;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
