import { Hotel } from "../../hotels/entities/hotel.entity";
export declare class Room {
    id: string;
    hotel_id: string;
    hotel: Hotel;
    room_number: number;
    room_type: string;
    floor: number;
    initial_status: string;
    rate_per_night: number;
    capacity: number;
    room_amenities: string[];
    room_description: string;
    font_image: string;
    images: string[];
}
