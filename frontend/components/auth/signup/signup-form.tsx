"use client";

import { useUserRegisterMutation } from "@/service/authantication/Auth";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Role = "GUEST_USER" | "PROPERTY_OWNER";

export default function SignupForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("GUEST_USER");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [userRegister, { isLoading, isError, error }] =
    useUserRegisterMutation();

  if (isError) {
    console.log(error, "inspect the error!");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = (error: unknown) => {
    const fallback = "Registration failed. Please try again.";
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

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role,
      ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      ...(formData.address && { address: formData.address }),
    };
    console.log(payload, "this is payload after send to backend!");

    try {
      await userRegister(payload).unwrap();

      toast("Registration successful! Please log in");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
      });
      router.push("/login");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 sm:py-3 border border-[#E7E5E4] rounded-md text-base text-gray-600 placeholder-[#979191] focus:outline-none focus:ring-1 focus:ring-[#1e2d4a] focus:border-[#1e2d4a] transition-colors";

  return (
    <section className='bg-(--text-secondary) py-8 px-4 sm:px-6 flex flex-col rounded-[10px]'>
      {/* Logo */}
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

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-md sm:max-w-lg md:min-w-125 mx-auto'>
          {/* Header */}
          <div className='pb-6 text-center'>
            <h1 className='text-2xl sm:text-3xl font-semibold text-(--text-primary) mb-1'>
              Sign Up
            </h1>
            <p>Welcome to Elach</p>
          </div>

          {/* Role Tabs */}
          <div className='flex rounded-md overflow-hidden border border-[#E7E5E4] mb-5'>
            {(["GUEST_USER", "PROPERTY_OWNER"] as Role[]).map((r) => (
              <button
                key={r}
                type='button'
                onClick={() => setRole(r)}
                className='flex-1 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none'
                style={{
                  background: role === r ? "var(--text-brand)" : "transparent",
                  color: role === r ? "#ffffff" : "#979191",
                  borderRight:
                    r === "GUEST_USER" ? "1px solid #E7E5E4" : "none",
                }}>
                {r === "GUEST_USER" ? "Guest User" : "Property Owner"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-3'>
            {/* First & Last Name */}
            <div className='flex gap-3'>
              <div className='flex-1'>
                <label className='block text-base text-(--text-primary) mb-1.5'>
                  First Name
                </label>
                <input
                  type='text'
                  name='firstName'
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='First name'
                  className={inputClass}
                />
              </div>
              <div className='flex-1'>
                <label className='block text-base text-(--text-primary) mb-1.5'>
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Last name'
                  className={inputClass}
                />
              </div>
            </div>

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
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-base text-(--text-primary) mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  name='password'
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  className={inputClass}
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

            {/* Phone */}
            <div>
              <label className='block text-base text-(--text-primary) mb-1.5'>
                Phone Number
              </label>
              <input
                type='tel'
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder='+880 1XXX-XXXXXX'
                className={inputClass}
              />
            </div>

            {/* Address */}
            <div>
              <label className='block text-base text-(--text-primary) mb-1.5'>
                Address
              </label>
              <input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='123 Main St, Dhaka'
                className={inputClass}
              />
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-7 sm:mt-8 py-3.5 sm:py-4 bg-(--text-brand) text-white font-semibold rounded-full hover:bg-[#200808] active:scale-[0.98] transition-all duration-150 text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className='text-center text-base text-[#262626] mt-5 sm:mt-6'>
            Already have an account?{" "}
            <Link
              href='/login'
              className='text-[#262626] font-medium underline'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
