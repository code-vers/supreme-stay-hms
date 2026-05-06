"use client";

import { useUserRegisterMutation } from "@/service/authantication/Auth";
import { userRegister as UserRegisterPayload } from "@/type/RegisterType";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type UserRole = UserRegisterPayload["role"];

const isUserRole = (value: string): value is UserRole =>
  value === "GUEST_USER" || value === "PROPERTY_OWNER";

const signupRoles: Array<{ name: UserRole; label: string }> = [
  { name: "GUEST_USER", label: "Guest User" },
  { name: "PROPERTY_OWNER", label: "Property Owner" },
];

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

  const [step, setStep] = useState(1);
  const [ownerExtra, setOwnerExtra] = useState({
    nidNumber: "",
    dob: "",
    presentAddress: "",
    permanentAddress: "",
    profession: "",
    companyName: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);

  const [role, setRole] = useState<UserRole>("GUEST_USER");
  const [showPassword, setShowPassword] = useState(false);

  const [userRegister, { isLoading, isError, error }] =
    useUserRegisterMutation();

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

    // If property owner selected, run multi-step flow
    if (role === "PROPERTY_OWNER") {
      if (step === 1) {
        setStep(2);
        return;
      }

      if (step === 2) {
        setStep(3);
        return;
      }

      // step 3 -> final submit

      const form = new FormData();
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("role", role);
      if (formData.phoneNumber)
        form.append("phoneNumber", formData.phoneNumber);
      if (formData.address) form.append("address", formData.address);

      Object.entries(ownerExtra).forEach(([k, v]) => {
        if (v) form.append(k, v as string);
      });

      documents.forEach((f) => form.append("documents", f));

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/auth/register-owner`,
          {
            method: "POST",
            body: form,
          },
        );

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Submission failed");

        toast.success("Registration request submitted; awaiting approval");
        router.push("/login");
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      }

      return;
    }

    // Guest user normal path
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

  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setDocuments(Array.from(e.target.files));
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
          <div className='mb-5'>
            <div className='mb-2 text-sm text-[#675d5d]'>Select a role</div>
            <div className='flex rounded-md overflow-hidden border border-[#E7E5E4]'>
              {signupRoles.map((r, index) => (
                  <button
                    key={r.name}
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
                        index !== signupRoles.length - 1
                          ? "1px solid #E7E5E4"
                          : "none",
                    }}>
                    {r.label}
                  </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-3'>
            {/* Progress / Step indicator */}
            {role === "PROPERTY_OWNER" && (
              <div className='mb-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <div
                    className={step >= 1 ? "font-semibold" : "text-gray-400"}>
                    1. Account
                  </div>
                  <div
                    className={step >= 2 ? "font-semibold" : "text-gray-400"}>
                    2. Details
                  </div>
                  <div
                    className={step >= 3 ? "font-semibold" : "text-gray-400"}>
                    3. Documents
                  </div>
                </div>
                <div className='h-1 bg-gray-200 rounded mt-2'>
                  <div
                    className='h-1 bg-(--text-brand) rounded'
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}

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
            {!(role === "PROPERTY_OWNER" && step === 2) && (
              <input
                type='text'
                name='address'
                value={formData.address}
                onChange={handleChange}
                placeholder='123 Main St, Dhaka'
                className={inputClass}
              />
            )}

            {/* Property Owner extra fields (step 2) */}
            {role === "PROPERTY_OWNER" && step >= 2 && (
              <div className='space-y-2'>
                <input
                  type='text'
                  name='nidNumber'
                  value={ownerExtra.nidNumber}
                  onChange={(e) =>
                    setOwnerExtra({ ...ownerExtra, nidNumber: e.target.value })
                  }
                  placeholder='NID / Passport Number'
                  className={inputClass}
                />
                <input
                  type='date'
                  name='dob'
                  value={ownerExtra.dob}
                  onChange={(e) =>
                    setOwnerExtra({ ...ownerExtra, dob: e.target.value })
                  }
                  placeholder='Date of birth'
                  className={inputClass}
                />
                <input
                  type='text'
                  name='presentAddress'
                  value={ownerExtra.presentAddress}
                  onChange={(e) =>
                    setOwnerExtra({
                      ...ownerExtra,
                      presentAddress: e.target.value,
                    })
                  }
                  placeholder='Present address'
                  className={inputClass}
                />
                <input
                  type='text'
                  name='permanentAddress'
                  value={ownerExtra.permanentAddress}
                  onChange={(e) =>
                    setOwnerExtra({
                      ...ownerExtra,
                      permanentAddress: e.target.value,
                    })
                  }
                  placeholder='Permanent address'
                  className={inputClass}
                />
                <input
                  type='text'
                  name='profession'
                  value={ownerExtra.profession}
                  onChange={(e) =>
                    setOwnerExtra({ ...ownerExtra, profession: e.target.value })
                  }
                  placeholder='Profession'
                  className={inputClass}
                />
                <input
                  type='text'
                  name='companyName'
                  value={ownerExtra.companyName}
                  onChange={(e) =>
                    setOwnerExtra({
                      ...ownerExtra,
                      companyName: e.target.value,
                    })
                  }
                  placeholder='Company name (optional)'
                  className={inputClass}
                />
              </div>
            )}

            {/* Documents (step 3) */}
            {role === "PROPERTY_OWNER" && step === 3 && (
              <div className='space-y-2'>
                <label className='text-sm'>
                  Upload documents (NID front/back, photo)
                </label>
                <input
                  type='file'
                  multiple
                  accept='image/*,application/pdf'
                  onChange={handleDocChange}
                />
              </div>
            )}

            {/* Step-specific controls */}
            {role === "PROPERTY_OWNER" ? (
              <div className='flex gap-2'>
                {step > 1 && (
                  <button
                    type='button'
                    onClick={handlePrev}
                    className='flex-1 py-3.5 border rounded'>
                    Previous
                  </button>
                )}

                <button
                  type='submit'
                  className='flex-1 py-3.5 bg-(--text-brand) text-white font-semibold rounded-full'>
                  {step < 3 ? "Next" : "Submit Registration Request"}
                </button>
              </div>
            ) : (
              <button
                type='submit'
                disabled={isLoading}
                className='w-full mt-7 py-3.5 bg-(--text-brand) text-white font-semibold rounded-full disabled:opacity-50'>
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            )}
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
