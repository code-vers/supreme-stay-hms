import Link from "next/link";
import React from "react";

export default function Footer() {
  const menuLinks = [
    { name: "Home", href: "#" },
    { name: "Hotels", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Contact Us", href: "#" },
  ];
  const socialLinks = [
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
  ];
  return (
    <footer className='bg-(--text-brand) text-[#EDE4D8] py-16 px-6 md:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-7'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
              <Link href='/'>Elach</Link>
            </h2>

            <p className='text-[#B6A5A5] leading-relaxed max-w-2xl text-base md:text-lg'>
              Streamlining hotel operations with modern technology. Manage
              bookings, rooms, staff, and guest experiences all in one powerful
              platform. Built for efficiency, designed for excellence.
            </p>

            <div className='mt-6'>
              <h3 className='text-xl md:text-2xl font-semibold text-white mb-3 underline'>
                Connect With Us
              </h3>
            </div>
          </div>

          {/* Right Column - Menu & Social */}
          <div className='lg:col-span-5 grid grid-cols-2 gap-10 md:gap-10'>
            {/* Menu */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6'>Menu</h4>
              <ul className='space-y-3 text-[#B6A5A5]'>
                {menuLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='hover:text-white transition-colors'>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className='text-lg font-semibold text-white mb-6'>Social</h4>
              <ul className='space-y-3 text-[#B6A5A5]'>
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className='hover:text-white transition-colors'>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-8 pt-10 border-t border-[#B6A5A5]/30 flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-[#B6A5A5]'>
          <div className='text-center md:text-left'>
            © 2026. All rights reserved.
            <span className='hidden md:inline mx-3'>|</span>
            <a
              href='#'
              className='hover:text-white transition-colors block md:inline mt-2 md:mt-0'>
              Privacy Policy
            </a>
            <span className='mx-2'>|</span>
            <a href='#' className='hover:text-white transition-colors'>
              Terms of Service
            </a>
          </div>

          {/* Payment Methods - Using Inline SVGs */}
          <div className='flex items-center justify-center md:justify-end gap-6 flex-wrap'>
            {/* WhatsApp */}
            <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                className='w-5 h-5'>
                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.67-.806-.92-1.104-.25-.298-.51-.25-.67-.25-.17 0-.52.2-.72.4-.2.2-.8.8-.8 1.9 0 1.1.82 2.16 1.34 2.91.52.75 1.48 1.67 2.7 2.07 1.22.4 2.12.48 2.6.48.48 0 .67-.02.92-.3.25-.28.98-.96 1.24-1.32.26-.36.52-.3.88-.18.36.12 2.4 1.13 2.82 1.33.42.2.7.3.8.48.1.18.1.98-.3 1.48-.4.5-1.1.75-1.8.75z' />
              </svg>
            </div>

            {/* PayPal */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              className='h-6 w-10'>
              <path
                fill='#003087'
                d='M7.8 19.5H4.2L6.5 4.5h7.1c2.1 0 3.7 1.2 3.4 3.4-.3 2.1-2 3.6-4.1 3.6H11l-1.2 8z'
              />
              <path
                fill='#009CDE'
                d='M19.5 11.2c-.4 2.1-2.1 3.6-4.2 3.6h-2.9l-1 6.7h3.6c2 0 3.7-1.2 4.1-3.3.3-1.7.2-3-.6-4.1z'
              />
            </svg>

            {/* Mastercard */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 48 30'
              className='h-6 w-10'>
              <rect width='48' height='30' rx='4' fill='#EB001B' />
              <circle cx='18' cy='15' r='10' fill='#F79E1B' />
              <circle cx='30' cy='15' r='10' fill='#F79E1B' fillOpacity='0.8' />
            </svg>

            {/* Visa */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 48 30'
              className='h-6 w-10'>
              <rect width='48' height='30' rx='4' fill='#1A1F71' />
              <path d='M10 10H38V20H10V10Z' fill='#F7B600' />
              <text
                x='24'
                y='22'
                textAnchor='middle'
                fill='white'
                fontSize='12'
                fontWeight='bold'>
                VISA
              </text>
            </svg>

            {/* Google Pay */}
            <div className='h-6 w-10 bg-white rounded flex items-center justify-center text-xs font-bold text-black border border-gray-300'>
              G Pay
            </div>

            {/* Apple Pay */}
            <div className='h-6 w-10 bg-black rounded flex items-center justify-center'>
              <span className='text-white text-[13px] font-medium tracking-tight'>
                 Pay
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
