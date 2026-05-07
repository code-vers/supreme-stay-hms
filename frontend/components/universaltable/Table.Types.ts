import React from "react";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

export type TableAction<T> = {
  label: string;
  onClick: (row: T) => void;
  variant?: "view" | "edit" | "delete" | "default";
  icon?: React.ReactNode;
};

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: TableAction<T>[];
  rowKey: (row: T) => string;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  isLoading?: boolean;
}
