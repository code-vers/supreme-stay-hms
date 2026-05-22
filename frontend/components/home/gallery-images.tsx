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
      <div className='grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-3 w-full '>
        {/* Row 1, Col 1 — terrace */}
        <div className='overflow-hidden aspect-4/3 md:aspect-auto md:h-56 lg:h-96'>
          <Image
            src={images[0].src}
            alt={images[0].alt}
            className='w-full h-full object-cover'
            height={500}
            width={500}
          />
        </div>

        {/* Row 1, Col 2 — cliffside */}
        <div className='overflow-hidden aspect-4/3 md:aspect-auto md:h-56 lg:h-96'>
          <Image
            src={images[1].src}
            alt={images[1].alt}
            className='w-full h-full object-cover'
            height={500}
            width={500}
          />
        </div>

        {/* Col 3, Row 1–2 — wood living room (spans 2 rows) */}
        <div className='hidden md:block overflow-hidden md:row-span-2 md:h-full'>
          <Image
            src={images[2].src}
            alt={images[2].alt}
            className='w-full h-full object-cover'
            height={500}
            width={500}
          />
        </div>

        {/* Row 2, Col 1 — arched alcove */}
        <div className='overflow-hidden aspect-4/3 md:aspect-auto md:h-56 lg:h-96'>
          <Image
            src={images[3].src}
            alt={images[3].alt}
            className='w-full h-full object-cover'
            height={500}
            width={500}
          />
        </div>

        {/* Row 2, Col 2 — colorful sofa */}
        <div className='overflow-hidden aspect-4/3 md:aspect-auto md:h-56 lg:h-96'>
          <Image
            src={images[4].src}
            alt={images[4].alt}
            className='w-full h-full object-cover'
            height={500}
            width={500}
          />
        </div>

        {/* Wood room visible on mobile as its own cell */}
        <div className='md:hidden overflow-hidden aspect-4/3'>
          <Image
            src={images[2].src}
            alt={images[2].alt}
            className='w-full h-full object-cover'
            height={500}
            width={500}
          />
        </div>
      </div>
    </section>
  );
}
