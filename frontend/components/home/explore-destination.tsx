"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import Title from "../shared/title";
import Image from "next/image";

export default function ExploreDestination() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const destinationData = [
    {
      name: "Paris",
      description:
        "Experience the romance and culture of Paris with our curated selection of hotels, from charming boutique stays to luxurious accommodations in the heart of the city.",
      image: "/home/destination/dest1.png",
    },
    {
      name: "Tokyo",
      description:
        "Discover the vibrant energy of Tokyo with our handpicked hotels, offering a blend of modern luxury and traditional Japanese hospitality in the bustling metropolis.",
      image: "/home/destination/dest2.png",
    },
    {
      name: "New York",
      description:
        "Explore the iconic city of New York with our curated hotel selection, featuring stylish accommodations in prime locations, from trendy boutique hotels to upscale stays in the heart of Manhattan.",
      image: "/home/destination/dest3.png",
    },
  ];

  const handleCardClick = (index: number, e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle description on touch devices
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section className='max-w-480 mx-auto py-3 px-4 sm:px-6 lg:px-30 my-10 md:my-16 lg:mt-34'>
      <div className='flex flex-col justify-center items-center mb-10 md:mb-16'>
        <Title
          title='Explore by Destination'
          description='Discover our curated selection of top destinations, each offering unique experiences and unforgettable stays. Our Explore by Destination section has something for every traveler.'
          className=''
          descriptionClassName='max-w-250 mx-auto'
        />
      </div>
      {/* Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
        {destinationData.map((dest, index) => (
          <div key={dest.name} className='overflow-hidden'>
            {/* Image Container with hover overlay */}
            <div
              className='group relative w-full h-56 sm:h-64 md:h-72 overflow-hidden cursor-pointer'
              onClick={(e) => handleCardClick(index, e)}>
              <Image
                height={300}
                width={400}
                src={dest.image}
                alt={dest.name}
                className='w-full h-full object-cover border border-(--border) rounded-lg group-hover:shadow-lg transition-shadow duration-300'
              />

              {/* Description overlay - appears on hover (desktop) or click (mobile) */}
              <div
                className={`absolute inset-0 bg-black/70 rounded-lg transition-opacity duration-300 flex items-center justify-center p-6 z-10 ${
                  expandedCard === index
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}>
                <p className='text-white text-center text-sm md:text-base leading-relaxed'>
                  {dest.description}
                </p>
              </div>
            </div>

            {/* Name below image - clickable to navigate */}
            <Link href='/hotels'>
              <div className='p-2 cursor-pointer hover:opacity-80 transition-opacity'>
                <h2 className='text-(--text-brand) text-2xl md:text-3xl'>
                  {dest.name}
                </h2>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
