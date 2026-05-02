"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Hotels", href: "/hotels" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <section className='border-b border-gray-200 bg-(--text-secondary) relative'>
      <nav className='max-w-480 mx-auto py-3 px-4 sm:px-6 lg:px-30 flex items-center justify-between'>
        {/* Logo */}
        <div className='text-2xl font-bold tracking-widest'>
          <Link
            href='/'
            className='text-(--text-brand) hover:text-gray-600 transition-colors'>
            Elach
          </Link>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden flex flex-col gap-1 text-gray-800'>
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all ${isOpen ? "opacity-0" : ""}`}></span>
          <span
            className={`w-6 h-0.5 bg-gray-800 transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>

        {/* Desktop Navigation Links */}
        <div className='hidden md:flex items-center gap-8 text-gray-800 font-medium'>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className='hover:text-gray-600 transition-colors text-lg'>
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className='hidden md:flex items-center gap-6'>
          <button className='px-6 py-2 text-gray-800 border border-gray-800 rounded-lg hover:bg-gray-100 transition-colors'>
            <Link href='/login'>Login</Link>
          </button>
          <button className='px-6 py-2 bg-(--text-brand) text-white rounded-lg hover:bg-[#3c2a22] transition-colors'>
            <Link href='/register'>Register</Link>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 border-t border-gray-200 bg-(--text-secondary) z-50 shadow-lg mx-5'>
          <div className=' px-4 py-4 space-y-3'>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className='block text-gray-800 hover:text-gray-600 transition-colors py-2 text-lg'>
                {link.name}
              </a>
            ))}
            <div className='flex flex-col gap-3 pt-4 border-t border-gray-200'>
              <button className='w-full px-6 py-2 text-gray-800 border border-gray-800 rounded-lg hover:bg-gray-100 transition-colors'>
                Login
              </button>
              <button className='w-full px-6 py-2 bg-(--text-brand) text-white rounded-lg hover:bg-[#3c2a22] transition-colors'>
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
