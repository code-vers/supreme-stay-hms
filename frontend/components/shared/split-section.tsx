import Image from "next/image";
import React from "react";

type SplitSectionProps = {
  title: string;
  description: string;
  buttonLabel?: string;
  imageSrc: string;
  imageAlt?: string;
  icon?: React.ReactNode;
  imageLeft?: boolean;
  className?: string;
};

export default function SplitSection({
  title,
  description,
  buttonLabel = "View Plan",
  imageSrc,
  imageAlt = "",
  icon,
  imageLeft = false,
  className = "",
}: SplitSectionProps) {
  /* ── Text panel ── */
  const textPanel = (
    <div className='w-full md:w-1/2 flex flex-col gap-6 min-w-0 py-3 px-4 sm:px-6 lg:px-12 max-w-480 md:max-w-none mx-auto md:mx-0'>
      {icon && (
        <div className='w-12 h-12 opacity-75 flex items-center justify-center'>
          {icon}
        </div>
      )}

      <h2
        className='
          font-serif text-[30px] lg:text-[40px]
          font-normal leading-[1.15] tracking-[-0.02em]
          text-[#0A0A0A] m-0
        '>
        {title}
      </h2>

      <p
        className='
          font-serif text-base lg:text-[18px]
          leading-[1.75] text-black m-0 xl:ml-10 
        '>
        {description}
      </p>

      {buttonLabel && (
        <button
          type='button'
          className='
            self-start md:self-start
            px-6 py-[0.7rem]
            bg-(--color-primary) hover:bg-[#360a0a] active:translate-y-0
            text-white font-serif text-sm tracking-[0.04em]
            rounded-md border-none cursor-pointer
            transition-all duration-200 ease-in-out
            hover:-translate-y-px
            w-full md:w-auto text-center xl:ml-10
          '>
          {buttonLabel}
        </button>
      )}
    </div>
  );

  /* ── Image panel ── */
  const imagePanel = (
    <div className='w-full md:w-1/2 min-w-0 px-2'>
      {/* border frame — matches the white-bordered card in the design */}
      <div
        className='
          group relative w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto
          aspect-3/4 sm:aspect-4/3 md:aspect-3/4
          border-2 border-(--color-card-border) p-1
          rounded-sm
        '>
        <div className='relative h-full w-full overflow-hidden rounded-sm '>
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover transition-transform duration-500 ease-in-out group-hover:scale-105'
          />
        </div>
      </div>
    </div>
  );

  /* ── Layout ── */
  return (
    <section
      className={`
        flex flex-col md:flex-row
        ${imageLeft ? "md:flex-row-reverse" : "md:flex-row"}
        items-center
        gap-[clamp(0.75rem,2vw,1.5rem)]
        px-2 lg:px-17
        py-14
        overflow-hidden
        ${className}
      `}>
      {textPanel}
      {imagePanel}
    </section>
  );
}
