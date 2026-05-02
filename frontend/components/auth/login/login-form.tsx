"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  return (
    <section className='bg-(--text-secondary) py-8 px-4 sm:px-6 flex flex-col rounded-[10px]'>
      {/* Logo at the top center - Clickable */}
      <div className='flex justify-center '>
        <Link href='/' className='inline-block'>
          <Image
            src='/logo1.png'
            alt='Elach'
            width={190}
            height={52}
            priority
            className='h-8 md:h-9 lg:h-12 w-auto object-contain mb-4'
          />
        </Link>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-md sm:max-w-lg md:min-w-125 mx-auto'>
          {/* Header */}
          <div className='pb-6 text-center'>
            <h1 className='text-2xl sm:text-3xl font-semibold text-(--text-primary) mb-1'>
              Sign In
            </h1>
            <p>Welcome to Elach</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className='space-y-3 '>
            {/* Email */}
            <div>
              <label className='block text-base text-(--text-primary) mb-1.5'>
                Email
              </label>
              <input
                type='email'
                name='email'
                required
                value={formData.email}
                onChange={handleChange}
                placeholder='user@gmail.com'
                className='w-full px-3 py-2.5 sm:py-3 border border-[#E7E5E4] rounded-md text-base text-gray-600 placeholder-[#979191] focus:outline-none focus:ring-1 focus:ring-[#1e2d4a] focus:border-[#1e2d4a] transition-colors'
              />
            </div>

            {/* Password */}
            <div>
              <div className='flex justify-between'>
                <label className='block text-base text-(--text-primary) mb-1.5'>
                  Password
                </label>
                <Link
                  href='/forgot-password'
                  className='text-base text-[#262626] underline'>
                  Forgot your password?
                </Link>
              </div>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  className='w-full px-3 py-2.5 sm:py-3 border border-[#E7E5E4] rounded-md text-base text-gray-600 placeholder-[#979191] focus:outline-none focus:ring-1 focus:ring-[#1e2d4a] focus:border-[#1e2d4a] transition-colors'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-7 sm:mt-8 py-3.5 sm:py-4 bg-(--text-brand) text-white font-semibold rounded-full hover:bg-[#200808] active:scale-[0.98] transition-all duration-150 text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className='text-center text-base text-[#262626] mt-5 sm:mt-6'>
            Don&apos;t have an account?{" "}
            <Link
              href='/register'
              className='text-[#262626] font-medium underline'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
