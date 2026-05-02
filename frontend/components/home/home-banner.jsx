import Image from "next/image";
import Title from "../shared/title";

const HomeBanner = () => {
  return (
    <section className='w-full bg-[#efefef] border-3 border-(--border)'>
      <div className='mx-auto px-0 sm:px-3 md:p-3'>
        <div className='relative h-65 sm:h-80 md:h-200 overflow-hidden'>
          {/* Background image */}
          <Image
            src='/home/banner.jpg'
            alt='Renewable energy installation'
            fill
            priority
            className='object-cover object-center'
          />

          {/* VERY SUBTLE LEFT BLUR (FIGMA-LIKE) */}
          <div className='absolute inset-0 pointer-events-none'>
            {/* Blur layer (very light) */}
            <div className='absolute left-0 top-0 h-full w-full backdrop-blur-[1px]' />

            {/* Soft fade (not dark) */}
            <div
              className='
                absolute left-0 top-0 h-full w-[48%]
                bg-linear-to-r
                from-black/25
                via-black/12
                to-transparent
              '
            />
          </div>

          {/* Content */}
          <div className='relative z-10 h-full flex items-start justify-center'>
            <div className='mt-8 md:mt-15'>
              <Title
                title='Plan Your Staycation With Us'
                description='Discover the best hotels, resorts, and vacation rentals for your next getaway. Book with confidence and enjoy unforgettable experiences.'
                className=''
                titleClassName='text-gray-400! md:text-(--text-brand)!'
                descriptionClassName='text-white! md:text-(--text-brand)!'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
