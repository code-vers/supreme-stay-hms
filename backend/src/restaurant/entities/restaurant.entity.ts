import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { MenuItem } from 'src/menu_items/entities/menu_item.entity';
import { RestaurantTable } from 'src/restaurant-table/entities/restaurant-table.entity';

export enum RestaurantType {
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  CAFE = 'cafe',
  SPA = 'spa',
}

export enum RestaurantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('restaurant')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RestaurantType })
  type: RestaurantType;

  @Column({ type: 'enum', enum: RestaurantStatus })
  status: RestaurantStatus;

  @OneToMany(() => RestaurantTable, (table) => table.restaurant)
  tables: RestaurantTable[];

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menuItems: MenuItem[];
}
