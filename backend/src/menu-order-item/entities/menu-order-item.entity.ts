// src/menu-order-item/entities/menu-order-item.entity.ts
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { MenuItem } from 'src/menu_items/entities/menu_item.entity';
import { RestaurantTable } from 'src/restaurant-table/entities/restaurant-table.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
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

export enum OrderCategory {
  DINE_IN = 'dine_in',
  ROOM_SERVICE = 'room_service',
  TAKEAWAY = 'takeaway',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('menu_order_items')
export class MenuOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @Column({ type: 'uuid', nullable: true })
  table_id: string; // Room service হলে null

  @Column({ type: 'uuid', nullable: true })
  room_id: string; // Dine-in/Takeaway হলে null

  @Column({ type: 'uuid' })
  restaurant_id: string;

  @Column({ type: 'uuid' })
  menu_item_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // menu item er unit price

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number; // quantity * price

  @Column({ nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({ type: 'enum', enum: OrderCategory })
  category: OrderCategory;

  @Column({ type: 'timestamp', nullable: true })
  delivery_time: Date;

  // ── Relations ──────────────────────────────────────────────────────────────
  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @ManyToOne(() => RestaurantTable, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'table_id' })
  table: RestaurantTable;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => MenuItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
