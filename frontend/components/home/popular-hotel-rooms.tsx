import React from "react";
import Title from "../shared/title";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PopularHotelRooms() {
  const hotelRoomsData = [
    {
      name: "Deluxe Suite",
      description:
        "Experience the epitome of luxury in our Deluxe Suite, featuring elegant decor, a spacious living area, and breathtaking city views. Perfect for travelers seeking comfort and sophistication.",
      image: "/home/hotels/hotel1.jpg",
    },
    {
      name: "Ocean View Room",
      description:
        "Wake up to stunning ocean views in our Ocean View Room, designed for relaxation and tranquility. Enjoy modern amenities and a serene ambiance for an unforgettable stay by the sea.",
      image: "/home/hotels/hotel2.png",
    },
    {
      name: "Cozy Standard Room",
      description:
        "Our Cozy Standard Room offers a comfortable and inviting space for travelers seeking simplicity and convenience. Perfect for solo adventurers or couples looking for a cozy retreat.",
      image: "/home/hotels/hotel3.jpg",
    },
  ];
  return (
    <section className='bg-[#BFA5A3]'>
      <div className='max-w-480 mx-auto'>
        {/* Title */}
        <div className='flex flex-col justify-center items-center mb-10 md:mb-16 py-12'>
          <Title
            title='Browse Popular Hotels & Rooms'
            description='Discover our curated selection of top-rated hotels and rooms, handpicked for your comfort and convenience. Whether you’re seeking a luxurious stay or a cozy retreat, explore our popular options to find the perfect accommodation for your next trip.'
            className=''
            titleClassName='text-[#201818]   mx-auto font-normal!'
            descriptionClassName='max-w-200 mx-auto'
          />
        </div>
        {/* Hotel Rooms Card */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-5 sm:px-6 lg:px-40 pb-16'>
          {hotelRoomsData.map((room) => (
            <div
              key={room.name}
              className='bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-xs cursor-pointer'>
              <Image
                src={room.image}
                alt={room.name}
                width={960}
                height={768}
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                quality={90}
                className='w-full h-122 object-cover'
                priority
              />
              <div className='p-4'>
                <h3 className='text-2xl font-semibold mb-2'>{room.name}</h3>
                <p className='text-(--color-body) text-sm'>
                  {room.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* View More Button */}
        <div className='flex justify-center pb-10'>
          <Link
            href='/hotels'
            className='px-6 py-[0.7rem]
              bg-(--color-primary) hover:bg-[#360a0a] active:translate-y-0
              text-white font-serif text-sm tracking-[0.04em]
              rounded-md border-none cursor-pointer
              transition-all duration-200 ease-in-out
              hover:-translate-y-px justify-center gap-2 flex items-center font-semibold hover:underline'>
            View More Hotels & Rooms
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
