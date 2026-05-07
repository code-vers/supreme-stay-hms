/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/purchase-item/entities/purchase-item.entity.ts
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PurchaseStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  item_id: string;

  @Column({ type: 'uuid' })
  supplier_id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'timestamp', nullable: true })
  received_at: Date;

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @ManyToOne(() => Supplier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => InventoryItem, (item) => item.purchases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
