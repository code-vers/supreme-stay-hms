// src/billing/entities/billing.entity.ts
import { Booking } from 'src/booking/entities/booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { MenuOrderItem } from 'src/menu-order-item/entities/menu-order-item.entity';
import { Reservation } from 'src/restaurant_table_reservation/entities/restaurant_table_reservation.entity';
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

export enum BillingType {
  ROOM_BOOKING = 'room_booking',
  MENU_ORDER = 'menu_order',
  TABLE_RESERVATION = 'table_reservation',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  ONLINE = 'online',
  STRIPE = 'stripe',
}

export enum BillingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('billing')
export class Billing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  // ── Billing type — কোন ধরনের payment ────────────────────────────────────
  @Column({ type: 'enum', enum: BillingType })
  billing_type: BillingType;

  // ── Conditional references (type অনুযায়ী একটা populated থাকবে) ──────────
  @Column({ type: 'uuid', nullable: true })
  booking_id: string; // room_booking হলে

  @Column({ type: 'uuid', nullable: true })
  menu_order_id: string; // menu_order হলে

  @Column({ type: 'uuid', nullable: true })
  reservation_id: string; // table_reservation হলে

  // ── Room info (room_booking এর জন্য) ─────────────────────────────────────
  @Column({ type: 'uuid', nullable: true })
  room_id: string;

  // ── Payment details ───────────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  final_amount: number; // amount - discount

  @Column({ type: 'enum', enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: BillingStatus,
    default: BillingStatus.PENDING,
  })
  status: BillingStatus;

  @Column({ nullable: true })
  transaction_id: string; // Stripe/card transaction ID

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date;

  @Column({ nullable: true })
  note: string; // extra info / receipt note

  // ── Relations ─────────────────────────────────────────────────────────────
  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Booking, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @ManyToOne(() => MenuOrderItem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'menu_order_id' })
  menuOrder: MenuOrderItem;

  @ManyToOne(() => Reservation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
