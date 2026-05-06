import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Entity('hotel')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @Column()
  hotel_name: string;

  @Column({ type: 'float', nullable: true })
  default_rating: number;

  @Column({ nullable: true })
  tagline: string;

  @Column()
  cover_image: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  postal_code: number;

  @Column()
  hotel_phone: string;

  @Column()
  reservation_phone: string;

  @Column()
  hotel_email: string;

  @Column({ nullable: true })
  hotel_website: string;

  @Column()
  no_of_rooms: number;

  @Column()
  no_of_floors: number;

  @Column({ nullable: true })
  hotel_desc: string;

  // PostgreSQL text[]
  @Column('text', { array: true, nullable: true })
  hotel_amenities: string[];

  @Column('text', { array: true, nullable: true })
  gallery_images: string[];

  @Column({ nullable: true })
  room_id: string;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.hotel)
  restaurants: Restaurant[];
}
