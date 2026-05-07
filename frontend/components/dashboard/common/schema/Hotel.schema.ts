import { z } from "zod";

export const hotelSchema = z.object({
  // Step 1 - Basic Info
  hotel_name: z.string().min(2, "Hotel name must be at least 2 characters"),
  tagline: z.string().optional(),
  hotel_desc: z.string().optional(),
  cover_image: z.any().optional(),

  // Step 2 - Location
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postal_code: z
    .string()
    .min(1, "Postal code is required")
    .transform((v) => Number(v)),

  // Step 3 - Contact
  hotel_phone: z.string().min(6, "Phone number is required"),
  reservation_phone: z.string().min(6, "Reservation phone is required"),
  hotel_email: z.string().email("Invalid email"),
  hotel_website: z.string().optional(),

  // Step 4 - Details
  no_of_rooms: z
    .string()
    .min(1, "Required")
    .transform((v) => Number(v)),
  no_of_floors: z
    .string()
    .min(1, "Required")
    .transform((v) => Number(v)),
  default_rating: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined)),

  // Step 5 - Amenities & Gallery
  hotel_amenities: z.array(z.string()).optional(),
  gallery_images: z.any().optional(),
});

export type HotelFormData = z.infer<typeof hotelSchema>;

// Steps definition
export const HOTEL_STEPS = [
  {
    title: "Basic Info",
    description: "Hotel name, tagline & cover image",
    fields: ["hotel_name", "tagline", "hotel_desc", "cover_image"],
  },
  {
    title: "Location",
    description: "Where is the hotel located?",
    fields: ["address", "city", "country", "postal_code"],
  },
  {
    title: "Contact",
    description: "How to reach the hotel",
    fields: [
      "hotel_phone",
      "reservation_phone",
      "hotel_email",
      "hotel_website",
    ],
  },
  {
    title: "Details",
    description: "Rooms, floors and rating",
    fields: ["no_of_rooms", "no_of_floors", "default_rating"],
  },
  {
    title: "Amenities & Gallery",
    description: "Features and photos",
    fields: ["hotel_amenities", "gallery_images"],
  },
] as const;

export const AMENITY_OPTIONS = [
  "Free WiFi",
  "Swimming Pool",
  "Gym",
  "Parking",
  "Restaurant",
  "Bar",
  "Spa",
  "Room Service",
  "Laundry",
  "Conference Room",
  "Airport Shuttle",
  "Pet Friendly",
  "Air Conditioning",
  "24/7 Front Desk",
  "Business Center",
  "Kids Club",
];
