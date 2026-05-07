import { ReactNode } from "react";
import { FieldValues, Path } from "react-hook-form";
import { ZodType } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "switch"
  | "file"
  | "date"
  | "multiselect";

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  multiple?: boolean;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  colSpan?: 1 | 2; // for grid layout
}

export interface UniversalFormProps<T extends FieldValues> {
  title?: string;
  fields: FieldConfig<T>[];
  schema: ZodType<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void;
  submitText?: string;
  onCancel?: () => void;
  renderAfterField?: (fieldName: Path<T>) => ReactNode;
  /** For multi-step: which step fields to show (by index range) */
  visibleFields?: Path<T>[];
}
