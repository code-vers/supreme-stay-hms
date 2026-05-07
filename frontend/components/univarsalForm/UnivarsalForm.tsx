"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Controller,
  DefaultValues,
  FieldErrors,
  FieldValues,
  FormProvider,
  Resolver,
  useForm,
} from "react-hook-form";
import { UniversalFormProps } from "./Form.types";

export default function UniversalForm<T extends FieldValues>({
  title,
  fields,
  schema,
  defaultValues,
  onSubmit,
  submitText = "Submit",
  onCancel,
  renderAfterField,
  visibleFields,
}: UniversalFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(
      schema as unknown as Parameters<typeof zodResolver>[0],
    ) as Resolver<T>,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const { handleSubmit, control, formState } = methods;

  const [selectedFilesByField, setSelectedFilesByField] = useState<
    Record<string, { name: string; isImage: boolean; previewUrl?: string }[]>
  >({});
  const [isDragging, setIsDragging] = useState<Record<string, boolean>>({});

  const handleFileChange = (
    fieldName: string,
    files: FileList | null,
    multiple: boolean | undefined,
    currentValue: unknown,
    onChange: (value: unknown) => void,
  ) => {
    if (!files) return;
    let nextFiles: FileList | null = files;

    if (multiple) {
      const dt = new DataTransfer();
      const existing = currentValue instanceof FileList ? currentValue : null;
      if (existing)
        for (let i = 0; i < existing.length; i++) dt.items.add(existing[i]);
      for (let i = 0; i < files.length; i++) dt.items.add(files[i]);
      nextFiles = dt.files.length > 0 ? dt.files : null;
      onChange(nextFiles);
    } else {
      onChange(files[0]);
    }

    const src = multiple && nextFiles ? nextFiles : files;
    const previews: { name: string; isImage: boolean; previewUrl?: string }[] =
      [];
    for (let i = 0; i < src.length; i++) {
      const f = src[i];
      const isImage = f.type.startsWith("image/");
      previews.push({
        name: f.name,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(f) : undefined,
      });
    }
    setSelectedFilesByField((p) => ({ ...p, [fieldName]: previews }));
  };

  const removeFile = (
    fieldName: string,
    idx: number,
    currentValue: unknown,
    multiple: boolean | undefined,
    onChange: (value: unknown) => void,
  ) => {
    setSelectedFilesByField((p) => ({
      ...p,
      [fieldName]: p[fieldName]?.filter((_, i) => i !== idx) || [],
    }));
    if (multiple) {
      const dt = new DataTransfer();
      const files = currentValue as FileList;
      for (let i = 0; i < files.length; i++)
        if (i !== idx) dt.items.add(files[i]);
      onChange(dt.files.length > 0 ? dt.files : null);
    } else {
      onChange(null);
    }
  };

  const handleError = (errors: FieldErrors<T>) => {
    const first = fields.find((f) => errors[f.name]);
    if (first) {
      const el = document.getElementById(String(first.name));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const shownFields = visibleFields
    ? fields.filter((f) => visibleFields.includes(f.name))
    : fields;

  const inputCls = (hasError: boolean) =>
    `w-full px-3 py-2.5 text-sm border rounded-sm bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-1 focus:ring-[#411818]/40 transition ${
      hasError ? "border-red-400" : "border-[#cec1c1]"
    }`;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        className='space-y-5'>
        {title && (
          <h2 className='text-xl font-semibold text-[#201818]'>{title}</h2>
        )}

        <div className='grid grid-cols-2 gap-4'>
          {shownFields.map((field) => {
            const hasError = !!formState.errors[field.name];
            const span = field.colSpan === 2 ? "col-span-2" : "col-span-1";

            return (
              <div
                key={String(field.name)}
                id={String(field.name)}
                className={`flex flex-col gap-1.5 ${span}`}>
                {/* Label */}
                {field.type !== "checkbox" && field.type !== "switch" && (
                  <label className='text-sm font-medium text-[#4d3e3e]'>
                    {field.label}
                    {field.required && (
                      <span className='text-red-500 ml-0.5'>*</span>
                    )}
                  </label>
                )}

                {/* Text / Email / Password / Number */}
                {(field.type === "text" ||
                  field.type === "email" ||
                  field.type === "password" ||
                  field.type === "number") && (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...methods.register(field.name)}
                    className={inputCls(hasError)}
                  />
                )}

                {/* Textarea */}
                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    {...methods.register(field.name)}
                    rows={3}
                    className={`${inputCls(hasError)} resize-none`}
                  />
                )}

                {/* Select */}
                {field.type === "select" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: cf }) => (
                      <select {...cf} className={inputCls(hasError)}>
                        <option value=''>
                          {field.placeholder || "Select…"}
                        </option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}

                {/* Date */}
                {field.type === "date" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: cf }) => (
                      <input
                        type='date'
                        value={typeof cf.value === "string" ? cf.value : ""}
                        onChange={(e) => cf.onChange(e.target.value)}
                        className={inputCls(hasError)}
                      />
                    )}
                  />
                )}

                {/* Checkbox */}
                {field.type === "checkbox" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: cf }) => (
                      <label className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={cf.value || false}
                          onChange={(e) => cf.onChange(e.target.checked)}
                          className='w-4 h-4 accent-[#411818]'
                        />
                        <span className='text-sm text-[#4d3e3e]'>
                          {field.label}
                        </span>
                      </label>
                    )}
                  />
                )}

                {/* Switch */}
                {field.type === "switch" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: cf }) => (
                      <label className='flex items-center gap-3 cursor-pointer'>
                        <div
                          onClick={() => cf.onChange(!cf.value)}
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            cf.value ? "bg-[#411818]" : "bg-[#cec1c1]"
                          }`}>
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                              cf.value ? "left-5" : "left-0.5"
                            }`}
                          />
                        </div>
                        <span className='text-sm text-[#4d3e3e]'>
                          {field.label}
                        </span>
                      </label>
                    )}
                  />
                )}

                {/* Radio */}
                {field.type === "radio" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: cf }) => (
                      <div className='flex gap-4 flex-wrap'>
                        {field.options?.map((opt) => (
                          <label
                            key={opt.value}
                            className='flex items-center gap-2 cursor-pointer text-sm text-[#4d3e3e]'>
                            <input
                              type='radio'
                              value={opt.value}
                              checked={cf.value === opt.value}
                              onChange={() => cf.onChange(opt.value)}
                              className='accent-[#411818]'
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    )}
                  />
                )}

                {/* File upload */}
                {field.type === "file" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: cf }) => {
                      const fn = String(field.name);
                      const previews = selectedFilesByField[fn] || [];
                      const dragging = isDragging[fn] || false;

                      return (
                        <>
                          <label className='cursor-pointer'>
                            <input
                              type='file'
                              hidden
                              multiple={field.multiple}
                              onChange={(e) =>
                                handleFileChange(
                                  fn,
                                  e.target.files,
                                  field.multiple,
                                  cf.value,
                                  cf.onChange,
                                )
                              }
                            />
                            <div
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging((p) => ({ ...p, [fn]: false }));
                                handleFileChange(
                                  fn,
                                  e.dataTransfer.files,
                                  field.multiple,
                                  cf.value,
                                  cf.onChange,
                                );
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging((p) => ({ ...p, [fn]: true }));
                              }}
                              onDragLeave={() =>
                                setIsDragging((p) => ({ ...p, [fn]: false }))
                              }
                              className={`h-28 flex flex-col items-center justify-center rounded-sm border-2 border-dashed transition-colors ${
                                dragging
                                  ? "border-[#411818] bg-[#411818]/5"
                                  : "border-[#cec1c1] hover:border-[#411818]/40"
                              }`}>
                              <Upload
                                size={18}
                                className='text-[#7f6b6b] mb-1.5'
                              />
                              <p className='text-xs text-[#4d3e3e]'>
                                <span className='font-medium text-[#411818]'>
                                  Click or drag
                                </span>{" "}
                                to upload
                              </p>
                              <p className='text-[10px] text-[#b6a5a5] mt-0.5'>
                                Max 25MB
                              </p>
                            </div>
                          </label>

                          {previews.length > 0 && (
                            <div className='grid grid-cols-4 gap-2 mt-1'>
                              {previews.map((f, idx) => (
                                <div
                                  key={idx}
                                  className='relative aspect-square rounded border border-[#cec1c1] overflow-hidden'>
                                  {f.isImage && f.previewUrl ? (
                                    <Image
                                      src={f.previewUrl}
                                      alt={f.name}
                                      fill
                                      className='object-cover'
                                    />
                                  ) : (
                                    <div className='h-full flex items-center justify-center p-1'>
                                      <p className='text-[10px] text-center truncate text-[#7f6b6b]'>
                                        {f.name}
                                      </p>
                                    </div>
                                  )}
                                  <button
                                    type='button'
                                    onClick={() =>
                                      removeFile(
                                        fn,
                                        idx,
                                        cf.value,
                                        field.multiple,
                                        cf.onChange,
                                      )
                                    }
                                    className='absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]'>
                                    <X size={8} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    }}
                  />
                )}

                {/* Error */}
                {hasError && (
                  <p className='text-xs text-red-500'>
                    {formState.errors[field.name]?.message as string}
                  </p>
                )}

                {renderAfterField?.(field.name)}
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className='flex gap-3 pt-2'>
          {onCancel && (
            <button
              type='button'
              onClick={onCancel}
              className='px-5 py-2.5 text-sm font-medium border border-[#cec1c1] text-[#4d3e3e] bg-white rounded-sm hover:bg-[#f3eded] transition-colors'>
              Cancel
            </button>
          )}
          <button
            type='submit'
            disabled={formState.isSubmitting}
            className='px-6 py-2.5 text-sm font-medium bg-[#411818] text-white rounded-sm hover:bg-[#5a2020] disabled:opacity-60 transition-colors flex items-center gap-2'>
            {formState.isSubmitting && (
              <Loader2 size={14} className='animate-spin' />
            )}
            {formState.isSubmitting ? `${submitText}...` : submitText}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
