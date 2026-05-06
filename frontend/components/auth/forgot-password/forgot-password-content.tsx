import Image from "next/image";
import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordContent() {
  return (
    <section className='relative w-full overflow-hidden'>
      <div className='absolute inset-0 h-full w-full overflow-hidden'>
        <Image
          src='/auth/auth.png'
          alt='Forgot password'
          fill
          className='absolute inset-0 h-full w-full object-cover'
        />
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute left-0 top-0 h-full w-full backdrop-blur-xs' />
          <div className='absolute left-0 top-0 h-full w-[48%] bg-linear-to-r from-black/25 via-black/12 to-transparent' />
        </div>
      </div>

      <div className='relative z-10 mx-4 md:mx-11.5 h-svh overflow-y-auto py-6 md:py-10'>
        <div className='mx-auto flex min-h-full w-full items-center justify-center'>
          <ForgotPasswordForm />
        </div>
      </div>
    </section>
  );
}
