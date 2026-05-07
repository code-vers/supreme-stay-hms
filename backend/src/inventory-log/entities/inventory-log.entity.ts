// src/inventory-log/entities/inventory-log.entity.ts
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum LogType {
  PURCHASE = 'purchase', // Stock
  USAGE = 'usage', // Stock
  ADJUSTMENT = 'adjustment', // Manual correction (+/-)
  WASTAGE = 'wastage', // Damage/expire (-)
}

@Entity('inventory_log')
export class InventoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  item_id: string;

  @Column({ type: 'enum', enum: LogType })
  type: LogType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  reference_id: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => InventoryItem, (item) => item.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: InventoryItem;

  @CreateDateColumn()
  created_at: Date;
}
