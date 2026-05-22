const stats = [
  { value: "1000+", label: "Partner Hotels" },
  { value: "38000+", label: "Successful Bookings" },
  { value: "27000+", label: "Happy Customers" },
  { value: "24000+", label: "Verified Reviews" },
];

export default function RegisterProperty() {
  return (
    <section className=' px-5 sm:px-6 lg:px-57 pb-26 font-serif'>
      <div className='relative max-w-480 mx-auto rounded-2xl overflow-hidden min-h-80 '>
        {/* Background image with dark overlay */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80')",
          }}
        />
        <div className='absolute inset-0 bg-neutral-900/70' />

        {/* Content */}
        <div className='relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-10 px-8 py-12 sm:px-12 sm:py-14'>
          {/* Left: text + button */}
          <div className='flex-1 flex flex-col justify-center gap-5 text-center lg:text-left'>
            <h2 className='text-3xl sm:text-4xl font-normal text-white leading-tight tracking-tight'>
              Start Managing
              <br />
              Smarter Today
            </h2>
            <p className='text-sm text-neutral-300 leading-relaxed font-sans max-w-sm mx-auto lg:mx-0'>
              Join our network of partner hotels and experience the benefits of
              our HMS firsthand. From streamlined operations to increased
              bookings, we’re here to help you succeed in the hospitality
              industry.
            </p>
            <div>
              <button className='bg-[#3D1018] hover:bg-[#5a1825] transition-colors text-white text-sm font-sans font-medium px-6 py-3 rounded-md tracking-wide'>
                Register Your Property
              </button>
            </div>
          </div>

          {/* Right: stats grid */}
          <div className='grid grid-cols-2 gap-3 w-full lg:w-auto lg:self-center'>
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className='bg-white rounded-xl px-6 py-5 flex flex-col items-start gap-1 min-w-35'>
                <span className='text-2xl sm:text-3xl font-normal text-neutral-900 tracking-tight'>
                  {value}
                </span>
                <span className='text-xs text-neutral-500 font-sans'>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
