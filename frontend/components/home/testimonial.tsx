import Image from "next/image";

const testimonials = [
  {
    review:
      "The room was absolutely stunning — floor-to-ceiling windows with an ocean view I'll never forget. Check-in was seamless and the staff made us feel like VIPs from the moment we arrived.",
    name: "Sarah Johnson",
    role: "Business Traveler",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
  },
  {
    review:
      "Hands down the best hotel experience I've had in years. The breakfast spread was incredible, the bed was cloud-soft, and the concierge went above and beyond to book last-minute reservations for us.",
    name: "James Okafor",
    role: "Leisure Guest",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
  },
  {
    review:
      "I travel every week for work and this is now my go-to property. Fast Wi-Fi, a quiet workspace in the room, and the team always remembers my preferences. It genuinely feels like a home away from home.",
    name: "Priya Mehta",
    role: "Corporate Traveler",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className='w-5 h-5 text-amber-500 fill-amber-500'
          viewBox='0 0 24 24'>
          <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonial() {
  return (
    <section className='px-5 py-14 sm:px-10 lg:px-20 font-serif'>
      <div className='max-w-480 mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl sm:text-4xl font-normal text-neutral-900 tracking-tight mb-5'>
            What Clients Say About Us
          </h2>
          <p className='text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed font-sans'>
            Don’t just take our word for it — hear from the travelers who have
            experienced our HMS firsthand. From seamless bookings to
            unforgettable stays, our clients share their stories of how we’ve
            transformed their hospitality experience.
          </p>
        </div>

        {/* Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5 sm:px-6 lg:px-40 pb-16'>
          {testimonials.map(({ review, name, role, avatar, rating }) => (
            <div
              key={name}
              className='bg-[#FAF8F3] border border-neutral-300 rounded-2xl px-6 py-6 flex flex-col justify-between gap-6'>
              {/* Review text */}
              <p className='text-sm text-neutral-700 leading-relaxed font-sans'>
                {review}
              </p>

              {/* Footer: avatar + name + stars */}
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <Image
                    src={avatar}
                    alt={name}
                    className='w-11 h-11 rounded-full object-cover shrink-0'
                    width={44}
                    height={44}
                  />
                  <div>
                    <p className='text-sm font-semibold text-neutral-800 font-sans leading-tight'>
                      {name}
                    </p>
                    <p className='text-xs text-neutral-400 font-sans mt-0.5'>
                      {role}
                    </p>
                  </div>
                </div>
                <StarRating count={rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
