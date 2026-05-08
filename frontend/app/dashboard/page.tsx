"use client";

import { useDashboard } from "@/providers/DashboardProvider";
import { useGetHotelBookingReportQuery } from "@/service/booking/Booking";
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
  Loader2,
} from "lucide-react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Checked-in";

const statusColors: Record<string, string> = {
  confirmed: "bg-success-soft status-success",
  pending: "bg-warning-soft status-warning",
  cancelled: "bg-error-soft status-error",
  checked_in: "bg-info-soft status-info",
};

// ── Donut chart (pure CSS/SVG) ─────────────────────────────────────────────
function DonutChart({
  occupied,
  available,
}: {
  occupied: number;
  available: number;
}) {
  const total = occupied + available || 1;
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
            className='transition-all duration-1000'
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
          Occupied ({Math.round(pct * 100)}%)
        </div>
        <div className='flex items-center gap-1.5 text-[12px] text-secondary'>
          <span className='w-2.5 h-2.5 rounded-full bg-brand-soft'></span>
          Available ({Math.round((1 - pct) * 100)}%)
        </div>
      </div>
    </div>
  );
}

// ── Revenue bar chart (sparkline) ─────────────────────────────────────────
function RevenueChart({ data }: { data: any[] }) {
  const months = data?.map((d) => d.month) || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenue = data?.map((d) => Number(d.revenue)) || [40, 65, 45, 80, 55, 70];
  const bookings = data?.map((d) => Number(d.bookings)) || [30, 50, 35, 60, 40, 55];
  const max = Math.max(...revenue, ...bookings, 100);

  return (
    <div className='flex items-end gap-3 h-24 mt-4 overflow-x-auto pb-2'>
      {months.map((m, i) => (
        <div key={m} className='flex-1 min-w-[30px] flex flex-col items-center gap-1'>
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
          <span className='text-[10px] text-muted whitespace-nowrap'>{m}</span>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { selectedHotelId } = useDashboard();
  const [revenuePeriod, setRevenuePeriod] = useState("Last 6 months");

  const { data: reportData, isLoading } = useGetHotelBookingReportQuery(
    selectedHotelId,
    { skip: !selectedHotelId }
  );

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-brand' />
      </div>
    );
  }

  const report = reportData;
  const summary = report?.summary || {};
  const monthlyRevenue = report?.monthly_revenue || [];
  
  const stats = [
    {
      label: "Total Revenue",
      value: `$${summary.total_revenue?.toLocaleString() || 0}`,
      icon: CalendarCheck,
      color: "status-warning",
      bg: "bg-warning-soft",
    },
    {
      label: "Total Bookings",
      value: summary.total_bookings || 0,
      icon: BedDouble,
      color: "status-success",
      bg: "bg-success-soft",
    },
    {
      label: "Today's Check-ins",
      value: summary.today_check_ins || 0,
      icon: CalendarDays,
      color: "status-info",
      bg: "bg-info-soft",
    },
    {
      label: "Today's Check-outs",
      value: summary.today_check_outs || 0,
      icon: BedSingle,
      color: "status-error",
      bg: "bg-error-soft",
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-heading'>Dashboard Overview</h1>
        <p className='text-[13px] text-muted mt-0.5'>
          Real-time analytics for your selected hotel.
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className='bg-surface rounded-xl p-5 border border-card shadow-sm hover:shadow-md transition-shadow'>
              <div
                className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-4`}>
                <Icon size={20} className={s.color} />
              </div>
              <p className='text-[13px] text-muted mb-1'>{s.label}</p>
              <p className='text-2xl font-bold text-heading'>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Middle row ── */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6'>
        {/* Left col */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <div className='bg-surface rounded-xl p-5 border border-card shadow-sm'>
            <h2 className='text-[15px] font-semibold text-heading mb-4'>
              Quick Actions
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              <button className='flex flex-col items-center gap-2 p-4 bg-brand text-white text-[12px] font-medium rounded-xl hover:opacity-90 transition shadow-sm'>
                <Plus size={18} /> Add Booking
              </button>
              <button className='flex flex-col items-center gap-2 p-4 bg-app text-secondary text-[12px] font-medium rounded-xl hover:bg-white transition border border-card'>
                <ShoppingCart size={18} /> POS Order
              </button>
              <button className='flex flex-col items-center gap-2 p-4 bg-app text-secondary text-[12px] font-medium rounded-xl hover:bg-white transition border border-card'>
                <RefreshCw size={18} /> Room Status
              </button>
              <button className='flex flex-col items-center gap-2 p-4 bg-app text-secondary text-[12px] font-medium rounded-xl hover:bg-white transition border border-card'>
                <ClipboardCheck size={18} /> Inventory
              </button>
            </div>
          </div>

          {/* Room Occupancy */}
          <div className='bg-surface rounded-xl p-5 border border-card shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-[15px] font-semibold text-heading'>
                Room Performance
              </h2>
              <button className='text-[12px] text-brand hover:underline'>
                View detailed report
              </button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-[13px] text-left'>
                <thead className='text-muted font-medium border-b border-card'>
                  <tr>
                    <th className='pb-3'>Room No</th>
                    <th className='pb-3'>Type</th>
                    <th className='pb-3'>Total Bookings</th>
                    <th className='pb-3 text-right'>Revenue</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-card'>
                  {report?.room_occupancy?.slice(0, 5).map((room: any) => (
                    <tr key={room.room_id}>
                      <td className='py-3 font-medium text-heading'>#{room.room_number}</td>
                      <td className='py-3 text-secondary'>{room.room_type}</td>
                      <td className='py-3 text-secondary'>{room.total_bookings}</td>
                      <td className='py-3 text-heading font-semibold text-right'>${Number(room.revenue).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(!report?.room_occupancy || report.room_occupancy.length === 0) && (
                    <tr>
                      <td colSpan={4} className='py-8 text-center text-muted'>No room performance data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className='space-y-6'>
          {/* Status Breakdown */}
          <div className='bg-surface rounded-xl p-5 border border-card shadow-sm'>
            <h2 className='text-[15px] font-semibold text-heading mb-4'>
              Occupancy Rate
            </h2>
            <DonutChart occupied={68} available={32} />
          </div>

          {/* Booking Statuses */}
          <div className='bg-surface rounded-xl p-5 border border-card shadow-sm'>
            <h2 className='text-[15px] font-semibold text-heading mb-4'>
              Booking Statuses
            </h2>
            <div className='space-y-3'>
              {report?.status_breakdown?.map((item: any) => (
                <div key={item.status} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className={`w-2 h-2 rounded-full ${statusColors[item.status] || 'bg-gray-300'}`} />
                    <span className='text-[13px] text-secondary capitalize'>{item.status.replace('_', ' ')}</span>
                  </div>
                  <span className='text-[13px] font-semibold text-heading'>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue Overview ── */}
      <div className='bg-surface rounded-xl p-5 border border-card shadow-sm'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div>
            <h2 className='text-[15px] font-semibold text-heading'>
              Financial Trend
            </h2>
            <p className='text-[11px] text-muted'>
              Monthly revenue and bookings analysis
            </p>
          </div>
          <select
            value={revenuePeriod}
            onChange={(e) => setRevenuePeriod(e.target.value)}
            className='text-[12px] border border-card rounded-lg px-3 py-1.5 text-secondary bg-surface focus:outline-none cursor-pointer'>
            <option>Last 6 months</option>
            <option>Last 12 months</option>
          </select>
        </div>
        <RevenueChart data={monthlyRevenue} />
        <div className='flex gap-6 mt-4 pt-4 border-t border-card'>
          <div className='flex items-center gap-2 text-[11px] text-secondary'>
            <span className='w-3 h-3 rounded-sm bg-brand'></span>{" "}
            Total Revenue
          </div>
          <div className='flex items-center gap-2 text-[11px] text-secondary'>
            <span className='w-3 h-3 rounded-sm bg-brand-soft'></span>{" "}
            Total Bookings
          </div>
        </div>
      </div>
    </div>
  );
}
