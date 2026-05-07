"use client";

import {
  BedDouble,
  Bell,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Hotel,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  ShieldCheck,
  UserCircle,
  UserCog,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  { label: "Rooms", href: "/dashboard/rooms", icon: BedDouble },
  { label: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
  { label: "Restaurant", href: "/dashboard/restaurant", icon: UtensilsCrossed },
  { label: "Billings", href: "/dashboard/billings", icon: Receipt },
  { label: "Guests", href: "/dashboard/guests", icon: Users },
  { label: "Staffs", href: "/dashboard/staffs", icon: UserCog },
  {
    label: "Attendance & Roles",
    href: "/dashboard/attendance",
    icon: ClipboardList,
  },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Permissions", href: "/dashboard/permissions", icon: ShieldCheck },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [selectedHotel, setSelectedHotel] = useState("Select Hotel");

  return (
    <div className='flex h-screen bg-app font-sans overflow-hidden'>
      {/* ── Sidebar ── */}
      <aside className='w-[200px] min-w-[200px] bg-surface flex flex-col border-r border-card shadow-sm'>
        {/* Logo */}
        <div className='flex items-center gap-2 px-4 py-4 border-b border-card'>
          <div className='w-7 h-7 rounded-md bg-brand flex items-center justify-center'>
            <Hotel size={14} className='text-white' />
          </div>
          <span className='font-bold text-[15px] text-heading tracking-tight'>
            UHMS
          </span>
          <ChevronRight size={14} className='ml-auto text-muted' />
        </div>

        {/* Nav */}
        <nav className='flex-1 py-2 overflow-y-auto'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-4 py-[9px] mx-2 rounded-lg text-[13px] font-medium transition-all group ${
                  active
                    ? "bg-soft text-brand"
                    : "text-secondary hover:bg-white hover:text-heading"
                }`}>
                <Icon
                  size={15}
                  className={
                    active
                      ? "text-brand"
                      : "text-muted group-hover:text-secondary"
                  }
                />
                {item.label}
                {active && (
                  <ChevronRight size={12} className='ml-auto text-brand' />
                )}
              </Link>
            );
          })}

          <div className='mx-2 mt-1'>
            <button className='flex items-center gap-2.5 px-4 py-[9px] w-full rounded-lg text-[13px] font-medium status-error hover:bg-white transition-all'>
              <LogOut size={15} className='status-error' />
              Logout
            </button>
          </div>
        </nav>

        {/* User */}
        <div className='border-t border-card px-4 py-3 flex items-center gap-2'>
          <div className='w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-[11px] font-bold'>
            S
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-[12px] font-semibold text-heading truncate'>
              shadcn
            </p>
            <p className='text-[10px] text-muted truncate'>m@example.com</p>
          </div>
          <ChevronRight size={12} className='text-placeholder' />
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <header className='bg-surface border-b border-card px-6 py-3 flex items-center gap-3 shadow-sm'>
          {/* Hotel selector */}
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className='text-[13px] border border-card rounded-lg px-3 py-1.5 text-secondary bg-surface focus:outline-none focus:ring-2 ring-brand-soft cursor-pointer min-w-[160px]'>
            <option>Select Hotel</option>
            <option>Grand Plaza Hotel</option>
            <option>Ocean View Resort</option>
          </select>

          <div className='ml-auto flex items-center gap-3'>
            <button className='relative w-8 h-8 rounded-full bg-app flex items-center justify-center hover:bg-white transition'>
              <Bell size={15} className='text-secondary' />
              <span className='absolute top-1 right-1 w-2 h-2 bg-[var(--color-error)] rounded-full'></span>
            </button>
            <div className='w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-[12px] font-bold cursor-pointer'>
              S
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
