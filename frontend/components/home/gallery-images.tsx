import Image from "next/image";
import Title from "../shared/title";

const images = [
  {
    src: "/home/gallery/gallery4.png",
    alt: "Tropical terrace with ocean view",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/home/gallery/gallery3.png",
    alt: "Modern cliffside house at sunset",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/home/gallery/gallery5.png",
    alt: "Scandinavian wood-paneled living room",
    className: "col-span-1 row-span-2",
  },
  {
    src: "/home/gallery/gallery1.png",
    alt: "Minimalist arched alcove interior",
    className: "col-span-1 row-span-1",
  },
  {
    src: "/home/gallery/gallery2.png",
    alt: "Colorful outdoor sofa with yellow wall",
    className: "col-span-1 row-span-1",
  },
];

export default function GalleryImages() {
  return (
    <section className='px-0 pt-8 pb-16 font-serif'>
      {/* Header */}
      <div className='flex flex-col justify-center items-center mb-10 md:mb-16 py-12'>
        <Title
          title='Gallery of Stays & Spaces'
          titleClassName='text-[#201818]   mx-auto font-normal!'
        />
      </div>

      {/* Grid */}
      <div className='flex gap-3 overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 md:grid-rows-2 md:overflow-visible w-full'>
        {/* Row 1, Col 1 — terrace */}
        <div className='snap-start shrink-0 w-full relative overflow-hidden h-48 sm:h-56 md:h-auto lg:h-96'>
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>

        {/* Row 1, Col 2 — cliffside */}
        <div className='snap-start shrink-0 w-full relative overflow-hidden h-48 sm:h-56 md:h-auto lg:h-96'>
          <Image
            src={images[1].src}
            alt={images[1].alt}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>

        {/* Col 3, Row 1–2 — wood living room (spans 2 rows) */}
        <div className='hidden md:block relative overflow-hidden md:row-span-2 md:h-full'>
          <Image
            src={images[2].src}
            alt={images[2].alt}
            fill
            className='object-cover'
            sizes='(max-width: 1024px) 50vw, 33vw'
          />
        </div>

        {/* Row 2, Col 1 — arched alcove */}
        <div className='snap-start shrink-0 w-full relative overflow-hidden h-48 sm:h-56 md:h-auto lg:h-96'>
          <Image
            src={images[3].src}
            alt={images[3].alt}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>

        {/* Row 2, Col 2 — colorful sofa */}
        <div className='snap-start shrink-0 w-full relative overflow-hidden h-48 sm:h-56 md:h-auto lg:h-96'>
          <Image
            src={images[4].src}
            alt={images[4].alt}
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>

        {/* Wood room visible on mobile as its own cell */}
        <div className='md:hidden snap-start shrink-0 w-full relative overflow-hidden h-48 sm:h-56'>
          <Image
            src={images[2].src}
            alt={images[2].alt}
            fill
            className='object-cover'
            sizes='100vw'
          />
        </div>
      </div>
    </section>
  );
}
