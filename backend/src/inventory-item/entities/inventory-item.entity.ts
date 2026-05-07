/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/inventory-item/entities/inventory-item.entity.ts
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { InventoryLog } from 'src/inventory-log/entities/inventory-log.entity';
import { PurchaseItem } from 'src/purchase-item/entities/purchase-item.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ItemCategory {
  KITCHEN = 'kitchen',
  HOUSEKEEPING = 'housekeeping',
  MINIBAR = 'minibar',
}

export enum ItemUnit {
  KG = 'kg',
  PCS = 'pcs',
  LITER = 'liter',
  BOX = 'box',
  PACK = 'pack',
}

export enum ItemStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @Column({ type: 'uuid' })
  suppliers_id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ItemCategory })
  category: ItemCategory;

  @Column({ type: 'enum', enum: ItemUnit })
  unit: ItemUnit;

  @Column({ type: 'int', default: 0 })
  current_stock: number;

  // Low stock alert threshold
  @Column({ type: 'int', default: 10 })
  low_stock_threshold: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_price: number;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.IN_STOCK,
  })
  status: ItemStatus;

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @ManyToOne(() => Supplier, (supplier) => supplier.inventoryItems, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'suppliers_id' })
  supplier: Supplier;

  @OneToMany(() => InventoryLog, (log) => log.item)
  logs: InventoryLog[];

  @OneToMany(() => PurchaseItem, (purchase) => purchase.item)
  purchases: PurchaseItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
