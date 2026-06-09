"use client";

import { useCreateHotelMutation, hotelApi } from "@/service/hotel/Hotel";
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
import { useDispatch } from "react-redux";
import {
  Controller,
  type ControllerRenderProps,
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import {
  AMENITY_OPTIONS,
  HOTEL_STEPS,
  HotelFormData,
  hotelSchema,
} from "../../common/schema/Hotel.schema";

// ── Input helpers ──────────────────────────────────────────────────────────
const inputCls = (err?: boolean) =>
  `w-full px-3 py-2.5 text-sm border rounded-lg bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-2 focus:ring-[#411818]/20 transition-all ${
    err ? "border-red-400" : "border-[#cec1c1]"
  }`;

const fileToDataUrl = (file: File) =>
new Promise<string>((resolve, reject) => {
  // 10MB limit
  if (file.size > 10 * 1024 * 1024) {
    reject(new Error("File is too large (max 10MB)"));
    return;
  }
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result ?? ""));
  reader.onerror = () => reject(new Error("Failed to read image file"));
  reader.readAsDataURL(file);
});

// ── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({
  steps,
  current,
}: {
  steps: typeof HOTEL_STEPS;
  current: number;
}) {
  return (
    <div className='flex items-center gap-0 mb-8 overflow-x-auto pb-2 scrollbar-hide'>
      {steps.map((step, idx) => {
        const done = idx < current;
        const active = idx === current;
        return (
          <div
            key={step.title}
            className='flex items-center flex-1 last:flex-none min-w-15'>
            <div className='flex flex-col items-center'>
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-all ${
                  done
                    ? "bg-[#411818] border-[#411818] text-white"
                    : active
                      ? "bg-white border-[#411818] text-[#411818]"
                      : "bg-white border-[#cec1c1] text-[#b6a5a5]"
                }`}>
                {done ? <Check size={12} /> : idx + 1}
              </div>
              <p
                className={`text-[9px] sm:text-[10px] mt-1 font-medium whitespace-nowrap ${
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
export default function AddHotelForm({
  onClose,
  onSuccess,
}: {
  onClose?: () => void;
  onSuccess?: () => Promise<any>;
}) {
  const [step, setStep] = useState(0);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<
    { name: string; url: string }[]
  >([]);
  const dispatch = useDispatch();
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();

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
      default_rating: 4.0 as never,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    control,
  } = methods;

  const onInvalid = (e: any) =>
    console.log("❌ Form Submission Failed: Errors:", e);

  const selectedAmenities =
    useWatch({
      control,
      name: "hotel_amenities",
    }) || [];

  const currentStepFields = [
    ...HOTEL_STEPS[step].fields,
  ] as (keyof HotelFormData)[];

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Validate current step fields
    const isStepValid = await trigger(currentStepFields);

    // Check if there are any errors in the current step fields
    const currentErrors = Object.keys(errors).filter((field) =>
      currentStepFields.includes(field as keyof HotelFormData),
    );

    if (isStepValid && currentErrors.length === 0) {
      setStep((s) => Math.min(s + 1, HOTEL_STEPS.length - 1));
    } else {
      console.log("Validation failed for step:", currentStepFields, errors);
      toast.error(
        "Please fill in all required fields correctly before proceeding.",
      );
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (data: HotelFormData) => {
    console.log("🚀 Submit button clicked! Payload:", data);
    try {
      // Convert images to base64 if they are Files
      let coverBase64 = typeof data.cover_image === "string" ? data.cover_image : "";
      if (data.cover_image instanceof File) {
        coverBase64 = await fileToBase64(data.cover_image);
      }

      const galleryBase64s: string[] = [];
      if (data.gallery_images instanceof FileList) {
        for (const file of Array.from(data.gallery_images)) {
          galleryBase64s.push(await fileToBase64(file));
        }
      } else if (Array.isArray(data.gallery_images)) {
        galleryBase64s.push(...data.gallery_images.filter(img => typeof img === 'string'));
      }

      const payload = {
        ...data,
        postal_code: Number(data.postal_code),
        no_of_rooms: Number(data.no_of_rooms),
        no_of_floors: Number(data.no_of_floors),
        default_rating: Number(data.default_rating || 4.0),
        cover_image: coverBase64,
        gallery_images: galleryBase64s,
      };

      console.log("📡 Sending payload to API:", payload);

      const result = await createHotel(payload).unwrap();

      console.log("✅ API Success result:", result);
      toast.success("Hotel added successfully!");

      // Manually invalidate the Hotel cache to ensure data refreshes
      console.log("🔄 Invalidating hotel cache...");
      dispatch(hotelApi.util.invalidateTags(["Hotels"]));

      // Reset form state after successful creation
      methods.reset();
      setCoverPreview(null);
      setGalleryPreviews([]);
      setStep(0);

      // Close modal immediately
      onClose?.();

      // Trigger refetch in the background (don't wait)
      if (onSuccess) {
        console.log("📡 Triggering hotel list refetch in background...");
        // Use setTimeout to ensure it happens after modal closes
        setTimeout(async () => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            console.log("📡 Calling refetch...");
            await onSuccess();
            console.log("✅ Hotel list refetch complete");
          } catch (refetchError) {
            console.error("❌ Refetch error:", refetchError);
          }
        }, 0);
      }
    } catch (error) {
      console.error("❌ API Error object:", error);
      toast.error("Failed to add hotel. Check console for details.");
    }
  };

  const toggleAmenity = (a: string) => {
    const current = [...selectedAmenities];
    const updated = current.includes(a)
      ? current.filter((x) => x !== a)
      : [...current, a];
    setValue("hotel_amenities", updated, { shouldValidate: true });
  };

  return (
    <FormProvider {...methods}>
      <div className='bg-white rounded-xl border border-[#cec1c1] p-5 sm:p-8 max-w-2xl w-full shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between mb-1'>
          <h2 className='text-xl font-bold text-[#201818]'>Add New Property</h2>
          {onClose && (
            <button
              onClick={onClose}
              className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f3eded] text-[#7f6b6b] transition-colors'>
              <X size={18} />
            </button>
          )}
        </div>
        <p className='text-[11px] sm:text-xs text-[#7f6b6b] mb-8'>
          {HOTEL_STEPS[step].description}
        </p>

        <StepIndicator steps={HOTEL_STEPS} current={step} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}>
          {/* ── Step 1: Basic Info ── */}
          {step === 0 && (
            <div className='space-y-5'>
              <div className='grid grid-cols-1 gap-5'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
                    Hotel Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    {...register("hotel_name")}
                    placeholder='e.g. Grand Plaza Hotel'
                    className={inputCls(!!errors.hotel_name)}
                  />
                  {errors.hotel_name && (
                    <p className='text-[10px] text-red-500 font-medium'>
                      {errors.hotel_name.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
                    Tagline
                  </label>
                  <input
                    {...register("tagline")}
                    placeholder='e.g. Where luxury meets comfort'
                    className={inputCls()}
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
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
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
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
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const dataUrl = await fileToDataUrl(file);
                                  field.onChange(dataUrl);
                                  setCoverPreview(dataUrl);
                                } catch (error) {
                                  toast.error(error instanceof Error ? error.message : "File upload failed");
                                }
                              }
                            }}
                          />
                          {coverPreview ? (
                            <div className='relative h-40 sm:h-48 rounded-lg overflow-hidden border border-[#cec1c1]'>
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
                                className='absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors'>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className='h-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#cec1c1] hover:border-[#411818]/40 hover:bg-[#fffef4] transition-all group'>
                              <Upload
                                size={24}
                                className='text-[#7f6b6b] mb-2 group-hover:scale-110 transition-transform'
                              />
                              <p className='text-[11px] text-[#4d3e3e]'>
                                <span className='font-bold text-[#411818]'>
                                  Click
                                </span>{" "}
                                to upload cover image
                              </p>
                              <p className='text-[9px] text-muted mt-1'>
                                Supports JPG, PNG (Max 5MB)
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
            <div className='space-y-5'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
                  Address <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("address")}
                  placeholder='Street address'
                  className={inputCls(!!errors.address)}
                />
                {errors.address && (
                  <p className='text-[10px] text-red-500 font-medium'>
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
                    City <span className='text-red-500'>*</span>
                  </label>
                  <input
                    {...register("city")}
                    placeholder='City'
                    className={inputCls(!!errors.city)}
                  />
                  {errors.city && (
                    <p className='text-[10px] text-red-500 font-medium'>
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className='flex flex-col gap-1.5'>
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
                    Country <span className='text-red-500'>*</span>
                  </label>
                  <input
                    {...register("country")}
                    placeholder='Country'
                    className={inputCls(!!errors.country)}
                  />
                  {errors.country && (
                    <p className='text-[10px] text-red-500 font-medium'>
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-1.5 w-1/2'>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
                  Postal Code <span className='text-red-500'>*</span>
                </label>
                <input
                  {...register("postal_code")}
                  type='number'
                  placeholder='1200'
                  className={inputCls(!!errors.postal_code)}
                />
                {errors.postal_code && (
                  <p className='text-[10px] text-red-500 font-medium'>
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Contact ── */}
          {step === 2 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
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
                  <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
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
                    <p className='text-[10px] text-red-500 font-medium'>
                      {errors[f.name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 4: Details ── */}
          {step === 3 && (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
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
                  <p className='text-[10px] text-red-500 font-medium'>
                    {errors.no_of_rooms.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
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
                  <p className='text-[10px] text-red-500 font-medium'>
                    {errors.no_of_floors.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider'>
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
            <div className='space-y-6'>
              {/* Amenities */}
              <div>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider block mb-3'>
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
                        className={`px-3 py-2 text-[10px] sm:text-xs rounded-lg border font-semibold transition-all shadow-sm ${
                          selected
                            ? "bg-[#411818] text-white border-[#411818]"
                            : "bg-white text-[#4d3e3e] border-[#cec1c1] hover:border-[#411818]/40"
                        }`}>
                        {selected && (
                          <Check size={12} className='inline mr-1.5' />
                        )}
                        {a}
                      </button>
                    );
                  })}
                </div>
                {selectedAmenities.length > 0 && (
                  <p className='text-[10px] text-[#7f6b6b] mt-3 font-medium'>
                    {selectedAmenities.length} amenit
                    {selectedAmenities.length === 1 ? "y" : "ies"} selected
                  </p>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label className='text-xs font-semibold text-[#4d3e3e] uppercase tracking-wider block mb-3'>
                  Gallery Photos
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
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (!files) return;
                            const newPreviews: { name: string; url: string }[] =
                              [];
                            const dataUrls: string[] = [];
                            for (let i = 0; i < files.length; i++) {
                              try {
                                const dataUrl = await fileToDataUrl(files[i]);
                                dataUrls.push(dataUrl);
                                newPreviews.push({
                                  name: files[i].name,
                                  url: dataUrl,
                                });
                              } catch (error) {
                                toast.error(`File ${files[i].name} is too large (max 10MB)`);
                              }
                            }
                            field.onChange([
                              ...(Array.isArray(field.value)
                                ? field.value
                                : []),
                              ...dataUrls,
                            ]);
                            setGalleryPreviews((p) => [...p, ...newPreviews]);
                          }}
                        />
                        <div className='h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#cec1c1] hover:border-[#411818]/40 hover:bg-[#fffef4] transition-all group'>
                          <Upload
                            size={20}
                            className='text-[#7f6b6b] mb-1.5 group-hover:scale-110 transition-transform'
                          />
                          <p className='text-[11px] text-[#4d3e3e]'>
                            <span className='font-bold text-[#411818]'>
                              Add Photos
                            </span>{" "}
                            (Select multiple)
                          </p>
                        </div>
                      </label>

                      {galleryPreviews.length > 0 && (
                        <div className='grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4'>
                          {galleryPreviews.map((img, idx) => (
                            <div
                              key={idx}
                              className='relative aspect-square rounded-lg overflow-hidden border border-[#cec1c1] shadow-sm'>
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
                                className='absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md'>
                                <X size={10} />
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
          <div className='flex justify-between mt-10 pt-6 border-t border-[#cec1c1]/40'>
            <button
              type='button'
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0 || isCreating}
              className='flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-2 border-[#cec1c1] text-[#4d3e3e] rounded-lg hover:bg-[#f3eded] transition-colors disabled:opacity-40 disabled:cursor-not-allowed'>
              <ChevronLeft size={16} /> Back
            </button>

            {step < HOTEL_STEPS.length - 1 ? (
              <button
                type='button'
                onClick={handleNext}
                className='flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold bg-[#411818] text-white rounded-lg hover:bg-[#5a2020] transition-all shadow-md active:scale-95'>
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type='submit'
                disabled={isCreating}
                className='flex items-center gap-2 px-8 py-2.5 text-xs sm:text-sm font-bold bg-[#411818] text-white rounded-lg hover:bg-[#5a2020] disabled:opacity-60 transition-all shadow-md active:scale-95'>
                {isCreating ? (
                  <>
                    <Loader2 size={16} className='animate-spin' />
                    Saving Property...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
