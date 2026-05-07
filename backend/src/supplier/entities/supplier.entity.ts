/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/supplier/entities/supplier.entity.ts
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';
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

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column('text', { array: true, nullable: true })
  item_supplier: string[];

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @OneToMany(() => InventoryItem, (item) => item.supplier)
  inventoryItems: InventoryItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
