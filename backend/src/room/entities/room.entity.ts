import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  hotel_id: string;

  @ManyToOne(() => Hotel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ type: 'int' })
  room_number: number;

  @Column()
  room_type: string;

  @Column({ type: 'int' })
  floor: number;

  @Column({ nullable: true })
  initial_status: string;

  @Column({ type: 'int' })
  rate_per_night: number;

  @Column({ type: 'int' })
  capacity: number;

  @Column('text', { array: true, nullable: true })
  room_amenities: string[];

  @Column({ nullable: true })
  room_description: string;

  @Column()
  font_image: string;

  @Column('text', { array: true, nullable: true })
  images: string[];
}
