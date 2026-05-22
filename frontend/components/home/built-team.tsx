import Image from "next/image";
import Title from "../shared/title";
import {
  BookUser,
  CalendarCheck,
  CircleCheck,
  CircleDollarSign,
  ClockFading,
  PanelTopDashed,
  Search,
  Star,
  TrendingUp,
  UserRound,
} from "lucide-react";

const adminFeatures = [
  {
    label: "Room Management",
    icon: <BookUser />,
  },
  {
    label: "Booking Control",
    icon: <CalendarCheck />,
  },
  {
    label: "Revenue Tracking",
    icon: <TrendingUp />,
  },
  {
    label: "Complaint Management",
    icon: <UserRound />,
  },
  {
    label: "Staff Role Access",
    icon: <PanelTopDashed />,
  },
];

const guestFeatures = [
  {
    label: "Search & Filter Rooms",
    icon: <Search />,
  },
  {
    label: "Instant Booking",
    icon: <CircleCheck />,
  },
  {
    label: "Secure Payment",
    icon: <CircleDollarSign />,
  },
  {
    label: "Booking History",
    icon: <ClockFading />,
  },
  {
    label: "Reviews & Ratings",
    icon: <Star />,
  },
];

export default function BuiltTeam() {
  return (
    <section className='px-5 py-12 sm:px-10 sm:py-16 lg:px-20 lg:py-20 font-serif'>
      <div className='max-w-480 mx-auto'>
        {/* Header */}
        <div className='flex flex-col justify-center items-center mb-10 md:mb-16 py-12'>
          <Title
            title='Built for Guests & Hotel Teams'
            description='Hotel guests and hotel staff have different needs, but our HMS is designed to serve both with equal excellence. From seamless booking experiences for guests to powerful management tools for hotel teams, we’ve built a solution that caters to everyone in the hospitality ecosystem.'
            className=''
            titleClassName='text-[#201818]   mx-auto font-normal!'
            descriptionClassName='max-w-200 mx-auto'
          />
        </div>

        {/* Two-column grid — stacks on mobile */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-start px-5 sm:px-6 lg:px-40 pb-16'>
          {/* LEFT COLUMN */}
          <div>
            {/* Admin label */}
            <p className='text-sm tracking-widest uppercase text-[#413a3a] mb-5 font-sans'>
              Admin
            </p>

            {/* Admin features */}
            <ul className='flex flex-col gap-3 mb-8'>
              {adminFeatures.map(({ label, icon }) => (
                <li
                  key={label}
                  className='flex items-center gap-3 text-[#120C0C] text-[18px] font-sans'>
                  <span className='text-[#120C0C] shrink-0'>{icon}</span>
                  {label}
                </li>
              ))}
            </ul>

            {/* Laptop image */}
            <div className='rounded-xs overflow-hidden w-full aspect-16/10 bg-neutral-200'>
              <Image
                src='/home/built/built2.jpg'
                alt='Admin dashboard on laptop'
                className='w-full h-full object-cover'
                width={500}
                height={500}
              />
            </div>
          </div>

          {/* RIGHT COLUMN — on mobile, reception image comes after admin features */}
          <div className='flex flex-col'>
            {/* Reception image */}
            <div className='rounded-xs overflow-hidden w-full aspect-16/10 bg-neutral-200 mb-8'>
              <Image
                src='/home/built/built1.jpg'
                alt='Hotel reception with staff and guest'
                className='w-full h-full object-cover'
                width={500}
                height={500}
              />
            </div>

            {/* Guest label */}
            <p className='text-sm tracking-widest uppercase text-[#413a3a] mb-5 text-left md:text-right font-sans'>
              Guest
            </p>

            {/* Guest features */}
            <ul className='flex flex-col gap-3'>
              {guestFeatures.map(({ label, icon }) => (
                <li
                  key={label}
                  className='flex items-center justify-start md:justify-end gap-3 text-[#120C0C] text-[18px]  font-sans'>
                  {/* On mobile: icon left, label right — on md+: label left, icon right */}
                  <span className='text-[#120C0C] shrink-0 md:hidden'>
                    {icon}
                  </span>
                  {label}
                  <span className='text-[#120C0C] shrink-0 hidden md:inline'>
                    {icon}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
