// src/booking/entities/booking.entity.ts
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingType {
  ONLINE = 'online',
  WALK_IN = 'walk_in',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
}

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guest_name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  id_or_passport_no: string;

  @Column({ type: 'date' })
  check_in: string;

  @Column({ type: 'date' })
  check_out: string;

  @Column({ type: 'int' })
  adults: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  children: number;

  @Column({ nullable: true })
  room_type: string;

  @Column({ type: 'int' })
  room_number: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ type: 'enum', enum: BookingType })
  booking_type: BookingType;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  booking_status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({ nullable: true })
  special_request: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  room_id: string;

  // Calculated fields
  @Column({ type: 'int', default: 0 })
  total_nights: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ nullable: true })
  cancellation_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date;

  // ── Relations ──────────────────────────────────────────────────────────────
  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
