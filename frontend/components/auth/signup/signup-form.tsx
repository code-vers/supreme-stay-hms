"use client";

import {
  useGetRolesQuery,
  useUserRegisterMutation,
} from "@/service/authantication/Auth";
import { userRegister as UserRegisterPayload } from "@/type/RegisterType";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type UserRole = UserRegisterPayload["role"];

const isUserRole = (value: string): value is UserRole =>
  value === "GUEST_USER" || value === "PROPERTY_OWNER";

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [role, setRole] = useState<UserRole>("GUEST_USER");
  const [showPassword, setShowPassword] = useState(false);

  const [userRegister, { isLoading, isError, error }] =
    useUserRegisterMutation();

  const { data } = useGetRolesQuery(undefined);
  const roles = data?.data || [];

  // ✅ Default role set (GUEST_USER)
  useEffect(() => {
    if (roles.length > 0) {
      const defaultRole = roles.find((r: any) => r.name === "GUEST_USER");
      const resolvedRole = defaultRole?.name || roles[0].name;
      if (isUserRole(resolvedRole)) {
        setRole(resolvedRole);
      }
    }
  }, [data]);

  if (isError) {
    console.log(error, "registration error");
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

    const payload: UserRegisterPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role, // ✅ ROLE NAME
      ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      ...(formData.address && { address: formData.address }),
    };

    try {
      await userRegister(payload).unwrap();

      toast.success("Registration successful! Please log in");

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

      {/* Main */}
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-md sm:max-w-lg md:min-w-125 mx-auto'>
          {/* Header */}
          <div className='pb-6 text-center'>
            <h1 className='text-2xl sm:text-3xl font-semibold text-(--text-primary) mb-1'>
              Sign Up
            </h1>
            <p>Welcome to Elach</p>
          </div>

          {/* Roles */}
          <div className='flex rounded-md overflow-hidden border border-[#E7E5E4] mb-5'>
            {roles.map((r: any, index: number) => (
              <button
                key={r.id}
                type='button'
                onClick={() => {
                  if (isUserRole(r.name)) {
                    setRole(r.name);
                  }
                }}
                className='flex-1 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none'
                style={{
                  background:
                    role === r.name ? "var(--text-brand)" : "transparent",
                  color: role === r.name ? "#fff" : "#979191",
                  borderRight:
                    index !== roles.length - 1 ? "1px solid #E7E5E4" : "none",
                }}>
                {r.name === "GUEST_USER" ? "Guest User" : "Property Owner"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-3'>
            {/* Name */}
            <div className='flex gap-3'>
              <input
                type='text'
                name='firstName'
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder='First name'
                className={inputClass}
              />
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

            {/* Email */}
            <input
              type='email'
              name='email'
              required
              value={formData.email}
              onChange={handleChange}
              placeholder='user@gmail.com'
              className={inputClass}
            />

            {/* Password */}
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
                className='absolute right-2 top-1/2 -translate-y-1/2'>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Phone */}
            <input
              type='tel'
              name='phoneNumber'
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder='+880 1XXX-XXXXXX'
              className={inputClass}
            />

            {/* Address */}
            <input
              type='text'
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='123 Main St, Dhaka'
              className={inputClass}
            />

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full mt-7 py-3.5 bg-(--text-brand) text-white font-semibold rounded-full disabled:opacity-50'>
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Login */}
          <p className='text-center mt-5'>
            Already have an account?{" "}
            <Link href='/login' className='underline'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
