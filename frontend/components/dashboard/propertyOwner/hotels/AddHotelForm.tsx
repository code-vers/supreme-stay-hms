"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Controller,
  type ControllerRenderProps,
  FormProvider,
  useForm,
} from "react-hook-form";
import {
  AMENITY_OPTIONS,
  HOTEL_STEPS,
  HotelFormData,
  hotelSchema,
} from "../../common/schema/Hotel.schema";

// ── Input helpers ──────────────────────────────────────────────────────────
const inputCls = (err?: boolean) =>
  `w-full px-3 py-2.5 text-sm border rounded-sm bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-1 focus:ring-[#411818]/40 transition ${
    err ? "border-red-400" : "border-[#cec1c1]"
  }`;

// ── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({
  steps,
  current,
}: {
  steps: typeof HOTEL_STEPS;
  current: number;
}) {
  return (
    <div className='flex items-center gap-0 mb-8'>
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div
            key={step.title}
            className='flex items-center flex-1 last:flex-none'>
            <div className='flex flex-col items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  done
                    ? "bg-[#411818] border-[#411818] text-white"
                    : active
                      ? "bg-white border-[#411818] text-[#411818]"
                      : "bg-white border-[#cec1c1] text-[#b6a5a5]"
                }`}>
                {done ? <Check size={13} /> : idx + 1}
              </div>
              <p
                className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                  active
                    ? "text-[#411818]"
                    : done
                      ? "text-[#411818]/70"
                      : "text-[#b6a5a5]"
                }`}>
                {step.title}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mb-5 transition-colors ${
                  done ? "bg-[#411818]" : "bg-[#cec1c1]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AddHotelForm({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<
    { name: string; url: string }[]
  >([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const methods = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema) as never,
    defaultValues: {
      hotel_name: "",
      tagline: "",
      hotel_desc: "",
      address: "",
      city: "",
      country: "",
      postal_code: "" as never,
      hotel_phone: "",
      reservation_phone: "",
      hotel_email: "",
      hotel_website: "",
      no_of_rooms: "" as never,
      no_of_floors: "" as never,
      hotel_amenities: [],
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
    control,
  } = methods;

  const currentStepFields = [
    ...HOTEL_STEPS[step].fields,
  ] as (keyof HotelFormData)[];

  const handleNext = async () => {
    const valid = await trigger(currentStepFields);
    if (valid) setStep((s) => Math.min(s + 1, HOTEL_STEPS.length - 1));
  };

  const onSubmit = (data: HotelFormData) => {
    // Attach amenities
    const finalData = { ...data, hotel_amenities: selectedAmenities };
    console.log("✅ Hotel Form Data:", finalData);
    alert("Hotel added successfully! Check console for data.");
    onClose?.();
  };

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
    setValue("hotel_amenities", selectedAmenities);
  };

  return (
    <FormProvider {...methods}>
      <div className='bg-white rounded-sm border border-[#cec1c1] p-6 max-w-2xl w-full'>
        {/* Header */}
        <div className='flex items-center justify-between mb-1'>
          <h2 className='text-lg font-bold text-[#201818]'>Add New Hotel</h2>
          {onClose && (
            <button
              onClick={onClose}
              className='w-7 h-7 flex items-center justify-center rounded hover:bg-[#f3eded] text-[#7f6b6b] transition'>
              <X size={15} />
            </button>
          )}
        </div>
        <p className='text-xs text-[#7f6b6b] mb-6'>
          {HOTEL_STEPS[step].description}
        </p>

        <StepIndicator steps={HOTEL_STEPS} current={step} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ── Step 1: Basic Info ── */}
          {step === 0 && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[#4d3e3e]'>
                    Hotel Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    {...register("hotel_name")}
                    placeholder='e.g. Grand Plaza Hotel'
                    className={inputCls(!!errors.hotel_name)}
                  />
                  {errors.hotel_name && (
                    <p className='text-xs text-red-500'>
                      {errors.hotel_name.message}
                    </p>
                  )}
                </div>

                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[#4d3e3e]'>
                    Tagline
                  </label>
                  <input
                    {...register("tagline")}
                    placeholder='e.g. Where luxury meets comfort'
                    className={inputCls()}
                  />
                </div>

                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[#4d3e3e]'>
                    Description
                  </label>
                  <textarea
                    {...register("hotel_desc")}
                    rows={3}
                    placeholder='Brief description of the hotel...'
                    className={`${inputCls()} resize-none`}
                  />
                </div>

                {/* Cover image */}
                <div className='col-span-2 flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[#4d3e3e]'>
                    Cover Image
                  </label>
                  <Controller
                    control={control}
                    name='cover_image'
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<
                        HotelFormData,
                        "cover_image"
                      >;
                    }) => (
                      <>
                        <label className='cursor-pointer'>
                          <input
                            type='file'
                            accept='image/*'
                            hidden
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.onChange(file);
                                setCoverPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                          {coverPreview ? (
                            <div className='relative h-36 rounded-sm overflow-hidden border border-[#cec1c1]'>
                              <Image
                                src={coverPreview}
                                alt='cover'
                                fill
                                className='object-cover'
                              />
                              <button
                                type='button'
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCoverPreview(null);
                                  field.onChange(null);
                                }}
                                className='absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center'>
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className='h-28 flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#cec1c1] hover:border-[#411818]/40 transition-colors'>
                              <Upload
                                size={18}
                                className='text-[#7f6b6b] mb-1.5'
                              />
                              <p className='text-xs text-[#4d3e3e]'>
                                <span className='font-medium text-[#411818]'>
                                  Click
                                </span>{" "}
                                to upload cover image
                              </p>
                            </div>
                          )}
                        </label>
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Location ── */}
          {step === 1 && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2 flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  Address <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("address")}
                  placeholder='Street address'
                  className={inputCls(!!errors.address)}
                />
                {errors.address && (
                  <p className='text-xs text-red-500'>
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  City <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("city")}
                  placeholder='City'
                  className={inputCls(!!errors.city)}
                />
                {errors.city && (
                  <p className='text-xs text-red-500'>{errors.city.message}</p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  Country <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("country")}
                  placeholder='Country'
                  className={inputCls(!!errors.country)}
                />
                {errors.country && (
                  <p className='text-xs text-red-500'>
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  Postal Code <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("postal_code")}
                  type='number'
                  placeholder='1200'
                  className={inputCls(!!errors.postal_code)}
                />
                {errors.postal_code && (
                  <p className='text-xs text-red-500'>
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 2 && (
            <div className='grid grid-cols-2 gap-4'>
              {[
                {
                  name: "hotel_phone" as const,
                  label: "Hotel Phone",
                  placeholder: "+880 1XXX-XXXXXX",
                  required: true,
                },
                {
                  name: "reservation_phone" as const,
                  label: "Reservation Phone",
                  placeholder: "+880 1XXX-XXXXXX",
                  required: true,
                },
                {
                  name: "hotel_email" as const,
                  label: "Hotel Email",
                  placeholder: "hotel@example.com",
                  required: true,
                },
                {
                  name: "hotel_website" as const,
                  label: "Website",
                  placeholder: "https://hotel.com",
                  required: false,
                },
              ].map((f) => (
                <div key={f.name} className='flex flex-col gap-1.5'>
                  <label className='text-sm font-medium text-[#4d3e3e]'>
                    {f.label}{" "}
                    {f.required && <span className='text-red-500'>*</span>}
                  </label>
                  <input
                    {...register(f.name)}
                    type={f.name === "hotel_email" ? "email" : "text"}
                    placeholder={f.placeholder}
                    className={inputCls(!!errors[f.name])}
                  />
                  {errors[f.name] && (
                    <p className='text-xs text-red-500'>
                      {errors[f.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 4: Details ── */}
          {step === 3 && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  Number of Rooms <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("no_of_rooms")}
                  type='number'
                  min={1}
                  placeholder='50'
                  className={inputCls(!!errors.no_of_rooms)}
                />
                {errors.no_of_rooms && (
                  <p className='text-xs text-red-500'>
                    {errors.no_of_rooms.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  Number of Floors <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("no_of_floors")}
                  type='number'
                  min={1}
                  placeholder='10'
                  className={inputCls(!!errors.no_of_floors)}
                />
                {errors.no_of_floors && (
                  <p className='text-xs text-red-500'>
                    {errors.no_of_floors.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium text-[#4d3e3e]'>
                  Default Rating
                </label>
                <input
                  {...register("default_rating")}
                  type='number'
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder='4.5'
                  className={inputCls()}
                />
              </div>
            </div>
          )}

          {/* ── Step 5: Amenities & Gallery ── */}
          {step === 4 && (
            <div className='space-y-5'>
              {/* Amenities */}
              <div>
                <label className='text-sm font-medium text-[#4d3e3e] block mb-2'>
                  Hotel Amenities
                </label>
                <div className='flex flex-wrap gap-2'>
                  {AMENITY_OPTIONS.map((a) => {
                    const selected = selectedAmenities.includes(a);
                    return (
                      <button
                        key={a}
                        type='button'
                        onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1.5 text-xs rounded-sm border font-medium transition-colors ${
                          selected
                            ? "bg-[#411818] text-white border-[#411818]"
                            : "bg-white text-[#4d3e3e] border-[#cec1c1] hover:border-[#411818]/40"
                        }`}>
                        {selected && (
                          <Check size={10} className='inline mr-1' />
                        )}
                        {a}
                      </button>
                    );
                  })}
                </div>
                {selectedAmenities.length > 0 && (
                  <p className='text-xs text-[#7f6b6b] mt-2'>
                    {selectedAmenities.length} amenit
                    {selectedAmenities.length === 1 ? "y" : "ies"} selected
                  </p>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label className='text-sm font-medium text-[#4d3e3e] block mb-2'>
                  Gallery Images
                </label>
                <Controller
                  control={control}
                  name='gallery_images'
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      HotelFormData,
                      "gallery_images"
                    >;
                  }) => (
                    <>
                      <label className='cursor-pointer'>
                        <input
                          type='file'
                          accept='image/*'
                          multiple
                          hidden
                          onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;
                            field.onChange(files);
                            const newPreviews: { name: string; url: string }[] =
                              [];
                            for (let i = 0; i < files.length; i++) {
                              newPreviews.push({
                                name: files[i].name,
                                url: URL.createObjectURL(files[i]),
                              });
                            }
                            setGalleryPreviews((p) => [...p, ...newPreviews]);
                          }}
                        />
                        <div className='h-20 flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#cec1c1] hover:border-[#411818]/40 transition-colors'>
                          <Upload size={16} className='text-[#7f6b6b] mb-1' />
                          <p className='text-xs text-[#4d3e3e]'>
                            <span className='font-medium text-[#411818]'>
                              Add photos
                            </span>{" "}
                            (multiple)
                          </p>
                        </div>
                      </label>

                      {galleryPreviews.length > 0 && (
                        <div className='grid grid-cols-5 gap-2 mt-3'>
                          {galleryPreviews.map((img, idx) => (
                            <div
                              key={idx}
                              className='relative aspect-square rounded-sm overflow-hidden border border-[#cec1c1]'>
                              <Image
                                src={img.url}
                                alt={img.name}
                                fill
                                className='object-cover'
                              />
                              <button
                                type='button'
                                onClick={() =>
                                  setGalleryPreviews((p) =>
                                    p.filter((_, i) => i !== idx),
                                  )
                                }
                                className='absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center'>
                                <X size={8} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className='flex justify-between mt-8 pt-4 border-t border-[#cec1c1]/50'>
            <button
              type='button'
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
              className='flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-[#cec1c1] text-[#4d3e3e] rounded-sm hover:bg-[#f3eded] transition-colors disabled:opacity-40 disabled:cursor-not-allowed'>
              <ChevronLeft size={14} /> Back
            </button>

            {step < HOTEL_STEPS.length - 1 ? (
              <button
                type='button'
                onClick={handleNext}
                className='flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-[#411818] text-white rounded-sm hover:bg-[#5a2020] transition-colors'>
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-[#411818] text-white rounded-sm hover:bg-[#5a2020] disabled:opacity-60 transition-colors'>
                {isSubmitting && <Loader2 size={13} className='animate-spin' />}
                {isSubmitting ? "Adding Hotel..." : "Add Hotel"}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
