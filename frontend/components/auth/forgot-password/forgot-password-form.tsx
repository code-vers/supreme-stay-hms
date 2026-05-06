"use client";

import { useForgetPasswordMutation } from "@/service/authantication/Auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const getErrorMessage = (error: unknown) => {
    const fallback = "Failed to send reset link. Please try again.";
    if (!error || typeof error !== "object") return fallback;

    const err = error as {
      data?: { message?: string | string[] };
      message?: string;
    };

    if (Array.isArray(err.data?.message)) return err.data.message.join(", ");
    if (typeof err.data?.message === "string") return err.data.message;
    if (typeof err.message === "string") return err.message;

    return fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgetPassword(email).unwrap();
      alert("Password reset link sent to your email.");
      setEmail("");
    } catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <section className='bg-(--text-secondary) py-8 px-4 sm:px-6 flex flex-col rounded-[10px] w-full max-w-md sm:max-w-lg md:min-w-125'>
      <div className='flex justify-center'>
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

      <div className='pb-6 text-center'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-(--text-primary) mb-1'>
          Forgot Password
        </h1>
        <p>Enter your email to receive a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-base text-(--text-primary) mb-1.5'>
            Email
          </label>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='user@gmail.com'
            className='w-full px-3 py-2.5 sm:py-3 border border-[#E7E5E4] rounded-md text-base text-gray-600 placeholder-[#979191] focus:outline-none focus:ring-1 focus:ring-[#1e2d4a] focus:border-[#1e2d4a] transition-colors'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full mt-4 py-3.5 sm:py-4 bg-(--text-brand) text-white font-semibold rounded-full hover:bg-[#200808] active:scale-[0.98] transition-all duration-150 text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
          {isLoading ? "Sending..." : "Resend"}
        </button>
      </form>

      <p className='text-center text-base text-[#262626] mt-5 sm:mt-6'>
        Back to{" "}
        <Link href='/login' className='text-[#262626] font-medium underline'>
          Sign In
        </Link>
      </p>
    </section>
  );
}
