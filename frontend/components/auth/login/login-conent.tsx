import Image from "next/image";
import LoginForm from "./login-form";

export default function LoginPageContent() {
  return (
    <section className='relative w-full overflow-hidden'>
      {/* Hero container */}
      <div className='absolute inset-0 w-full h-full overflow-hidden'>
        {/* Image Background */}
        <Image
          src='/auth/auth.png'
          alt='Login'
          fill
          className='absolute inset-0 w-full h-full object-cover'
        />
        {/* VERY SUBTLE LEFT BLUR (FIGMA-LIKE) */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Blur layer (very light) */}
          <div className='absolute left-0 top-0 h-full w-full backdrop-blur-xs' />

          {/* Soft fade (not dark) */}
          <div
            className='
                absolute left-0 top-0 h-full w-[48%]
                bg-linear-to-r
                from-black/25
                via-black/12
                to-transparent
              '
          />
        </div>

        {/* Dark overlay for text contrast */}
        <div className='absolute inset-0 ' />
      </div>
      {/* Content overlay */}
      <div className='relative z-10 mx-4 md:mx-11.5 h-svh overflow-y-auto py-6 md:py-10'>
        <div className='mx-auto flex min-h-full w-full items-center justify-center'>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
