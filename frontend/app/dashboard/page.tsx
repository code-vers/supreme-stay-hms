"use client";

import {
  BedDouble,
  BedSingle,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  Plus,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Checked-in";

const statusColors: Record<BookingStatus, string> = {
  Confirmed: "bg-success-soft status-success",
  Pending: "bg-warning-soft status-warning",
  Cancelled: "bg-error-soft status-error",
  "Checked-in": "bg-info-soft status-info",
};

// ── Mock data ──────────────────────────────────────────────────────────────
const stats = [
  {
    label: "Total Active Bookings",
    value: 12,
    icon: CalendarCheck,
    color: "status-warning",
    bg: "bg-warning-soft",
  },
  {
    label: "Available Rooms",
    value: 12,
    icon: BedDouble,
    color: "status-success",
    bg: "bg-success-soft",
  },
  {
    label: "Occupied Rooms",
    value: 12,
    icon: BedSingle,
    color: "status-error",
    bg: "bg-error-soft",
  },
  {
    label: "Today's Bookings",
    value: 12,
    icon: CalendarDays,
    color: "status-info",
    bg: "bg-info-soft",
  },
];

const recentBookings = [
  {
    name: "Sarah Johnson",
    hotel: "Grand Plaza Hotel",
    dates: "Mar 12, 2026 – Mar 13, 2026",
    amount: "$1,200",
    ref: "BB-2847",
    status: "Confirmed" as BookingStatus,
  },
  {
    name: "Sarah Johnson",
    hotel: "Grand Plaza Hotel",
    dates: "Mar 12, 2026 – Mar 13, 2026",
    amount: "$1,200",
    ref: "BB-2847",
    status: "Pending" as BookingStatus,
  },
  {
    name: "Sarah Johnson",
    hotel: "Grand Plaza Hotel",
    dates: "Mar 12, 2026 – Mar 13, 2026",
    amount: "$1,200",
    ref: "BB-2847",
    status: "Cancelled" as BookingStatus,
  },
  {
    name: "Sarah Johnson",
    hotel: "Grand Plaza Hotel",
    dates: "Mar 12, 2026 – Mar 13, 2026",
    amount: "$1,200",
    ref: "BB-2847",
    status: "Confirmed" as BookingStatus,
  },
  {
    name: "Sarah Johnson",
    hotel: "Grand Plaza Hotel",
    dates: "Mar 12, 2026 – Mar 13, 2026",
    amount: "$1,200",
    ref: "BB-2847",
    status: "Cancelled" as BookingStatus,
  },
  {
    name: "Sarah Johnson",
    hotel: "Grand Plaza Hotel",
    dates: "Mar 12, 2026 – Mar 13, 2026",
    amount: "$1,200",
    ref: "BB-2847",
    status: "Confirmed" as BookingStatus,
  },
];

const recentActivity = [
  {
    type: "R",
    label: "Restaurant Order",
    sub: "Order #RO-8947-001 - 12.7% accompaniment",
    time: "4 hours ago",
    color: "bg-warning-soft status-warning",
  },
  {
    type: "R",
    label: "Restaurant Order",
    sub: "Order #RO-8947-001 - 12.7% accompaniment",
    time: "4 hours ago",
    color: "bg-warning-soft status-warning",
  },
  {
    type: "R",
    label: "Restaurant Order",
    sub: "Order #RO-8947-001 - 12.7% accompaniment",
    time: "4 hours ago",
    color: "bg-warning-soft status-warning",
  },
  {
    type: "B",
    label: "New Room Booking",
    sub: "Praeni 1034 available",
    time: "4 hours ago",
    color: "bg-info-soft status-info",
  },
  {
    type: "B",
    label: "New Room Booking",
    sub: "Praeni 1034 available",
    time: "4 hours ago",
    color: "bg-info-soft status-info",
  },
  {
    type: "C",
    label: "Check-out from room 302",
    sub: "Room 9023 available",
    time: "4 hours ago",
    color: "bg-success-soft status-success",
  },
];

// ── Donut chart (pure CSS/SVG) ─────────────────────────────────────────────
function DonutChart({
  occupied,
  available,
}: {
  occupied: number;
  available: number;
}) {
  const total = occupied + available;
  const pct = occupied / total;
  const r = 60;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className='flex flex-col items-center justify-center py-4'>
      <div className='relative w-36 h-36'>
        <svg viewBox='0 0 140 140' className='w-full h-full -rotate-90'>
          <circle
            cx='70'
            cy='70'
            r={r}
            fill='none'
            stroke='var(--color-card-border)'
            strokeWidth='18'
          />
          <circle
            cx='70'
            cy='70'
            r={r}
            fill='none'
            stroke='var(--color-brand)'
            strokeWidth='18'
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-2xl font-bold text-heading'>
            {Math.round(pct * 100)}%
          </span>
          <span className='text-[11px] text-muted'>Occupied Rooms</span>
        </div>
      </div>
      <div className='flex gap-4 mt-3'>
        <div className='flex items-center gap-1.5 text-[12px] text-secondary'>
          <span className='w-2.5 h-2.5 rounded-full bg-brand'></span>
          Occupied (68%)
        </div>
        <div className='flex items-center gap-1.5 text-[12px] text-secondary'>
          <span className='w-2.5 h-2.5 rounded-full bg-brand-soft'></span>
          Available (32%)
        </div>
      </div>
    </div>
  );
}

// ── Revenue bar chart (sparkline) ─────────────────────────────────────────
function RevenueChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenue = [40, 65, 45, 80, 55, 70];
  const bookings = [30, 50, 35, 60, 40, 55];
  const max = 100;

  return (
    <div className='flex items-end gap-3 h-24 mt-4'>
      {months.map((m, i) => (
        <div key={m} className='flex-1 flex flex-col items-center gap-1'>
          <div className='w-full flex gap-0.5 items-end h-20'>
            <div
              className='flex-1 rounded-t-sm bg-brand'
              style={{ height: `${(revenue[i] / max) * 100}%` }}
            />
            <div
              className='flex-1 rounded-t-sm bg-brand-soft'
              style={{ height: `${(bookings[i] / max) * 100}%` }}
            />
          </div>
          <span className='text-[10px] text-muted'>{m}</span>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [revenuePeriod, setRevenuePeriod] = useState("Last 6 months");

  return (
    <div className='space-y-5'>
      {/* Header */}
      <div>
        <h1 className='text-[22px] font-bold text-heading'>Dashboard</h1>
        <p className='text-[13px] text-muted mt-0.5'>
          Here's what's happening with your hotels today.
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className='grid grid-cols-4 gap-4'>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className='bg-surface rounded-xl p-4 border border-card shadow-sm'>
              <div
                className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={s.color} />
              </div>
              <p className='text-[12px] text-muted mb-1'>{s.label}</p>
              <p className='text-2xl font-bold text-heading'>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Middle row: Quick Actions + Recent Bookings | Occupancy ── */}
      <div className='grid grid-cols-[1fr_280px] gap-4'>
        {/* Left col */}
        <div className='space-y-4'>
          {/* Quick Actions */}
          <div className='bg-surface rounded-xl p-4 border border-card shadow-sm'>
            <h2 className='text-[14px] font-semibold text-heading mb-3'>
              Quick Actions
            </h2>
            <div className='grid grid-cols-4 gap-2'>
              <button className='flex items-center gap-2 bg-brand text-white text-[12px] font-medium px-3 py-2 rounded-lg hover:opacity-90 transition'>
                <Plus size={13} /> Add Booking
              </button>
              <button className='flex items-center gap-2 bg-app text-secondary text-[12px] font-medium px-3 py-2 rounded-lg hover:bg-white transition border border-card'>
                <ShoppingCart size={13} /> POS Order
              </button>
              <button className='flex items-center gap-2 bg-app text-secondary text-[12px] font-medium px-3 py-2 rounded-lg hover:bg-white transition border border-card'>
                <RefreshCw size={13} /> Update Room Status
              </button>
              <button className='flex items-center gap-2 bg-app text-secondary text-[12px] font-medium px-3 py-2 rounded-lg hover:bg-white transition border border-card'>
                <ClipboardCheck size={13} /> Check Invst
              </button>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className='bg-surface rounded-xl p-4 border border-card shadow-sm'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <h2 className='text-[14px] font-semibold text-heading'>
                  Recent Bookings
                </h2>
                <p className='text-[11px] text-muted'>
                  Latest booking activity
                </p>
              </div>
              <button className='text-[12px] text-brand hover:underline flex items-center gap-0.5'>
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className='space-y-2'>
              {recentBookings.map((b, i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 py-2.5 border-b border-card last:border-0'>
                  <div className='w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0'>
                    {b.name.charAt(0)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span className='text-[13px] font-medium text-heading'>
                        {b.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className='text-[11px] text-muted truncate'>
                      {b.hotel}
                    </p>
                    <p className='text-[11px] text-muted'>{b.dates}</p>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <p className='text-[13px] font-semibold text-heading'>
                      {b.amount}
                    </p>
                    <p className='text-[11px] text-muted'>{b.ref}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className='space-y-4'>
          {/* Overall Occupancy */}
          <div className='bg-surface rounded-xl p-4 border border-card shadow-sm'>
            <h2 className='text-[14px] font-semibold text-heading'>
              Overall Occupancy
            </h2>
            <p className='text-[11px] text-muted'>Current occupancy rate</p>
            <DonutChart occupied={68} available={32} />
          </div>

          {/* Recent Activity */}
          <div className='bg-surface rounded-xl p-4 border border-card shadow-sm'>
            <h2 className='text-[14px] font-semibold text-heading mb-3'>
              Recent Activity
            </h2>
            <div className='space-y-2.5'>
              {recentActivity.map((a, i) => (
                <div key={i} className='flex items-start gap-2.5'>
                  <div
                    className={`w-6 h-6 rounded-full ${a.color} flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5`}>
                    {a.type}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-[12px] font-medium text-heading leading-tight'>
                      {a.label}
                    </p>
                    <p className='text-[10px] text-muted truncate'>
                      {a.sub}
                    </p>
                  </div>
                  <span className='text-[10px] text-placeholder flex-shrink-0'>
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue Overview ── */}
      <div className='bg-surface rounded-xl p-4 border border-card shadow-sm'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-[14px] font-semibold text-heading'>
              Revenue Overview
            </h2>
            <p className='text-[11px] text-muted'>
              Monthly revenue and bookings trend
            </p>
          </div>
          <select
            value={revenuePeriod}
            onChange={(e) => setRevenuePeriod(e.target.value)}
            className='text-[12px] border border-card rounded-lg px-3 py-1.5 text-secondary bg-surface focus:outline-none cursor-pointer'>
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
          </select>
        </div>
        <RevenueChart />
        <div className='flex gap-4 mt-2'>
          <div className='flex items-center gap-1.5 text-[11px] text-secondary'>
            <span className='w-2.5 h-2.5 rounded-sm bg-brand'></span>{" "}
            Revenue
          </div>
          <div className='flex items-center gap-1.5 text-[11px] text-secondary'>
            <span className='w-2.5 h-2.5 rounded-sm bg-brand-soft'></span>{" "}
            Bookings
          </div>
        </div>
      </div>
    </div>
  );
}



