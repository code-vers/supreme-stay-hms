"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Eye,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { TableAction, TableProps } from "./Table.Types";

// ── Helpers ────────────────────────────────────────────────────────────────
function getValue<T>(row: T, key: keyof T | string): unknown {
  return (row as Record<string, unknown>)[key as string];
}

function sortData<T>(data: T[], key: string, dir: "asc" | "desc"): T[] {
  return [...data].sort((a, b) => {
    const av = getValue(a, key);
    const bv = getValue(b, key);
    const an = Number(av);
    const bn = Number(bv);
    if (Number.isFinite(an) && Number.isFinite(bn))
      return dir === "asc" ? an - bn : bn - an;
    return dir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}

// ── Action button icons ────────────────────────────────────────────────────
function ActionBtn<T>({ action, row }: { action: TableAction<T>; row: T }) {
  const base =
    "inline-flex items-center justify-center w-7 h-7 rounded transition-colors";

  if (action.variant === "view")
    return (
      <button
        onClick={() => action.onClick(row)}
        className={`${base} text-[#411818]/50 hover:text-[#411818] hover:bg-[#411818]/10`}
        title='View'>
        {action.icon ?? <Eye size={14} />}
      </button>
    );
  if (action.variant === "edit")
    return (
      <button
        onClick={() => action.onClick(row)}
        className={`${base} text-[#411818]/50 hover:text-[#411818] hover:bg-[#411818]/10`}
        title='Edit'>
        {action.icon ?? <Pencil size={14} />}
      </button>
    );
  if (action.variant === "delete")
    return (
      <button
        onClick={() => action.onClick(row)}
        className={`${base} text-red-400 hover:text-red-600 hover:bg-red-50`}
        title='Delete'>
        {action.icon ?? <Trash2 size={14} />}
      </button>
    );
  return (
    <button
      onClick={() => action.onClick(row)}
      className={`${base} bg-[#411818] text-white hover:bg-[#5a2020] text-xs px-2 w-auto`}>
      {action.label}
    </button>
  );
}

// ── Status toggle ─────────────────────────────────────────────────────────
export function StatusBadge({
  value,
  onChange,
}: {
  value: boolean | string;
  onChange?: () => void;
}) {
  const active = value === true || value === "active" || value === "Active";
  return (
    <button
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium border transition-colors ${
        active
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
      }`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`}
      />
      {active ? "Active" : "Inactive"}
    </button>
  );
}

// ── Skeleton row ──────────────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className='border-b border-[#cec1c1]/30'>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className='px-4 py-3'>
          <div className='h-4 bg-[#f3eded] rounded animate-pulse' />
        </td>
      ))}
    </tr>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function UniversalTable<T>({
  data,
  columns,
  actions,
  rowKey,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  emptyText = "No data found.",
  isLoading = false,
}: TableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Search
  const searched = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(getValue(row, col.key) ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, query, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return searched;
    return sortData(searched, sortKey, sortDir);
  }, [searched, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleSearch = (v: string) => {
    setQuery(v);
    setPage(1);
  };

  const colCount = columns.length + (actions?.length ? 1 : 0);

  // Page numbers
  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (
        let i = Math.max(2, safePage - 1);
        i <= Math.min(totalPages - 1, safePage + 1);
        i++
      )
        pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className='bg-white border border-[#cec1c1] rounded-sm overflow-hidden'>
      {/* Search bar */}
      {searchable && (
        <div className='px-4 py-3 border-b border-[#cec1c1]/50 flex items-center gap-3'>
          <div className='relative flex-1 max-w-xs'>
            <Search
              size={14}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-[#b6a5a5]'
            />
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className='w-full pl-9 pr-3 py-1.5 text-sm border border-[#cec1c1] rounded bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-1 focus:ring-[#411818]/30'
            />
          </div>
          <span className='text-xs text-[#7f6b6b] ml-auto'>
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-[#411818] text-[#f8f6f6]'>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(String(col.key), col.sortable)}
                  className={`px-4 py-3 text-left text-xs font-semibold tracking-wide whitespace-nowrap ${
                    col.sortable
                      ? "cursor-pointer hover:bg-[#5a2020] select-none"
                      : ""
                  }`}>
                  <span className='flex items-center gap-1.5'>
                    {col.title}
                    {col.sortable && (
                      <span className='opacity-60'>
                        {sortKey === String(col.key) ? (
                          sortDir === "asc" ? (
                            <ChevronUp size={12} />
                          ) : (
                            <ChevronDown size={12} />
                          )
                        ) : (
                          <ChevronsUpDown size={12} />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
              {actions?.length ? (
                <th className='px-4 py-3 text-left text-xs font-semibold tracking-wide'>
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <SkeletonRow key={i} cols={colCount} />
              ))
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  className='px-4 py-12 text-center text-[#7f6b6b] text-sm'>
                  {emptyText}
                </td>
              </tr>
            ) : (
              pageItems.map((row, idx) => (
                <tr
                  key={rowKey(row)}
                  className={`border-b border-[#cec1c1]/30 transition-colors hover:bg-[#f3eded] ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#fffef4]"
                  }`}>
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className='px-4 py-3 text-[#4d3e3e] text-sm'>
                      {col.render
                        ? col.render(row)
                        : String(getValue(row, col.key) ?? "—")}
                    </td>
                  ))}
                  {actions?.length ? (
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-1'>
                        {actions.map((action) => (
                          <ActionBtn
                            key={action.label}
                            action={action}
                            row={row}
                          />
                        ))}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='px-4 py-3 border-t border-[#cec1c1]/50 flex items-center justify-between'>
          <span className='text-xs text-[#7f6b6b]'>
            Page {safePage} of {totalPages} &nbsp;·&nbsp; {sorted.length} total
          </span>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className='w-7 h-7 flex items-center justify-center rounded border border-[#cec1c1] text-[#411818] disabled:opacity-30 hover:bg-[#f3eded] transition-colors'>
              <ChevronLeft size={13} />
            </button>

            {pageNumbers().map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className='w-7 h-7 flex items-center justify-center text-[#7f6b6b] text-xs'>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-7 h-7 flex items-center justify-center rounded border text-xs font-medium transition-colors ${
                    safePage === p
                      ? "bg-[#411818] text-white border-[#411818]"
                      : "border-[#cec1c1] text-[#4d3e3e] hover:bg-[#f3eded]"
                  }`}>
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className='w-7 h-7 flex items-center justify-center rounded border border-[#cec1c1] text-[#411818] disabled:opacity-30 hover:bg-[#f3eded] transition-colors'>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
