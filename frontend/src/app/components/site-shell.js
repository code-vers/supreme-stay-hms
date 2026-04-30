"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <>
      {!isAuthPage && (
        <header className='bg-white shadow-sm'>
          <nav
            className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
            aria-label='Global'>
            <div className='flex lg:flex-1'>
              <Link href='/' className='-m-1.5 p-1.5'>
                <span className='sr-only'>Your Company</span>
                <img className='h-8 w-auto' src='/vercel.svg' alt='' />
              </Link>
            </div>
            <div className='flex lg:hidden'>{/* Mobile menu button */}</div>
            <div className='hidden lg:flex lg:gap-x-12'>
              <Link
                href='/dashboard'
                className='text-sm font-semibold leading-6 text-gray-900'>
                Dashboard
              </Link>
              <Link
                href='/bookings'
                className='text-sm font-semibold leading-6 text-gray-900'>
                Bookings
              </Link>
              <Link
                href='/rooms'
                className='text-sm font-semibold leading-6 text-gray-900'>
                Rooms
              </Link>
            </div>
            <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
              {user ? (
                <>
                  <span className='mr-4 text-sm font-semibold leading-6 text-gray-900'>
                    Hello, {user.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className='text-sm font-semibold leading-6 text-gray-900 hover:text-red-600'>
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href='/login'
                  className='text-sm font-semibold leading-6 text-gray-900'>
                  Log in <span aria-hidden='true'>&rarr;</span>
                </Link>
              )}
            </div>
          </nav>
          {/* Mobile menu */}
        </header>
      )}
      <main className='grow'>{children}</main>
    </>
  );
}
