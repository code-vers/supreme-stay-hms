import { Room } from "../../room/entities/room.entity";
import { Restaurant } from "../../restaurant/entities/restaurant.entity";
export declare class Hotel {
    id: string;
    owner_id: string;
    hotel_name: string;
    default_rating: number;
    tagline: string;
    cover_image: string;
    address: string;
    city: string;
    country: string;
    postal_code: number;
    hotel_phone: string;
    reservation_phone: string;
    hotel_email: string;
    hotel_website: string;
    no_of_rooms: number;
    no_of_floors: number;
    hotel_desc: string;
    hotel_amenities: string[];
    gallery_images: string[];
    room_id: string;
    rooms: Room[];
    restaurants: Restaurant[];
}
