"use client";

import { DashboardProvider, useDashboard } from "@/providers/DashboardProvider";
import { logoutUser, useGetMeQuery } from "@/service/authantication/Auth";
import { useGetOwnedHotelsQuery } from "@/service/hotel/Hotel";
import {
  BedDouble,
  Bell,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Hotel,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  ShieldCheck,
  UserCircle,
  UserCog,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedHotelId, setSelectedHotelId } = useDashboard();

  const { data: userData } = useGetMeQuery(undefined);
  const { data: hotelsData, isLoading: hotelsLoading } =
    useGetOwnedHotelsQuery(undefined);

  const hotels = hotelsData?.data?.items || [];
  const user = userData?.data || userData;

  // Set default hotel on load
  useEffect(() => {
    if (hotels.length > 0 && !selectedHotelId) {
      setSelectedHotelId(hotels[0].id);
    }
  }, [hotels, selectedHotelId, setSelectedHotelId]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className='flex h-screen bg-app font-sans overflow-hidden relative'>
      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300'
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-60 bg-surface flex flex-col border-r border-card shadow-lg z-50 transition-transform duration-300 transform lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Logo */}
        <div className='flex items-center gap-2 px-6 py-5 border-b border-card'>
          <div className='w-8 h-8 rounded-md bg-brand flex items-center justify-center shadow-sm'>
            <Hotel size={16} className='text-white' />
          </div>
          <span className='font-bold text-[16px] text-heading tracking-tight'>
            UHMS
          </span>
          <button
            onClick={closeSidebar}
            className='lg:hidden ml-auto text-muted'>
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className='flex-1 py-4 overflow-y-auto custom-scrollbar'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2.5 mx-3 rounded-lg text-[13px] font-medium transition-all group ${
                  active
                    ? "bg-soft text-brand shadow-sm"
                    : "text-secondary hover:bg-app hover:text-heading"
                }`}>
                <Icon
                  size={16}
                  className={
                    active
                      ? "text-brand"
                      : "text-muted group-hover:text-secondary"
                  }
                />
                {item.label}
                {active && (
                  <ChevronRight size={14} className='ml-auto text-brand' />
                )}
              </Link>
            );
          })}

          <div className='mx-3 mt-2 pt-2 border-t border-card'>
            <button
              onClick={handleLogout}
              className='flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer'>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className='border-t border-card px-4 py-4 flex items-center gap-3 bg-app/50'>
          <div className='w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-[12px] font-bold shadow-sm'>
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-[13px] font-semibold text-heading truncate'>
              {user?.firstName} {user?.lastName}
            </p>
            <p className='text-[11px] text-muted truncate'>{user?.email}</p>
          </div>
          <ChevronRight size={14} className='text-placeholder' />
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top bar */}
        <header className='bg-surface border-b border-card px-4 lg:px-8 py-3 flex items-center gap-4 shadow-sm z-30'>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='lg:hidden p-2 hover:bg-app rounded-md transition-colors text-secondary'>
            <Menu size={20} />
          </button>

          {/* Hotel selector */}
          <div className='relative flex-1 max-w-60'>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              disabled={hotelsLoading}
              className='w-full text-[13px] border border-card rounded-lg px-3 py-2 text-secondary bg-surface focus:outline-none focus:ring-2 ring-brand/20 transition-all cursor-pointer appearance-none'>
              <option value='' disabled>
                {hotelsLoading ? "Loading..." : "Select Hotel"}
              </option>
              {hotels.map((hotel: any) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.hotel_name}
                </option>
              ))}
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted'>
              <ChevronRight size={14} className='rotate-90' />
            </div>
          </div>

          <div className='ml-auto flex items-center gap-4'>
            <button className='relative w-9 h-9 rounded-full bg-app flex items-center justify-center hover:bg-white border border-card transition shadow-sm'>
              <Bell size={16} className='text-secondary' />
              <span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface'></span>
            </button>
            <div className='hidden sm:flex items-center gap-3 border-l border-card pl-4'>
              <div className='text-right'>
                <p className='text-[12px] font-bold text-heading leading-none'>
                  {user?.firstName}
                </p>
                <p className='text-[10px] text-muted mt-0.5 leading-none uppercase tracking-wider'>
                  {user?.role?.name?.replace("_", " ")}
                </p>
              </div>
              <div className='w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-[13px] font-bold shadow-sm cursor-pointer'>
                {user?.firstName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar'>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
