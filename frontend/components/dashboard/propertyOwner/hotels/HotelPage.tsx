"use client";

import { Column, TableAction } from "@/components/universaltable/Table.Types";
import UniversalTable, {
  StatusBadge,
} from "@/components/universaltable/Universaltable";
import { Building2, CheckCircle, ChevronRight, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import StatCard from "../../common/StatCard";
import AddHotelForm from "./AddHotelForm";

// ── Types ──────────────────────────────────────────────────────────────────
type HotelRow = {
  id: string;
  cover_image: string;
  hotel_name: string;
  city: string;
  country: string;
  default_rating: number;
  no_of_rooms: number;
  status: boolean;
};

// ── Demo data ──────────────────────────────────────────────────────────────
const DEMO_HOTELS: HotelRow[] = [
  {
    id: "1",
    cover_image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop",
    hotel_name: "Seaside Resort & Spa",
    city: "Cox's Bazar",
    country: "Bangladesh",
    default_rating: 4.8,
    no_of_rooms: 120,
    status: true,
  },
  {
    id: "2",
    cover_image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&h=60&fit=crop",
    hotel_name: "Grand Palace Hotel",
    city: "Dhaka",
    country: "Bangladesh",
    default_rating: 4.5,
    no_of_rooms: 85,
    status: true,
  },
  {
    id: "3",
    cover_image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=80&h=60&fit=crop",
    hotel_name: "Mountain View Inn",
    city: "Sylhet",
    country: "Bangladesh",
    default_rating: 4.2,
    no_of_rooms: 45,
    status: false,
  },
  {
    id: "4",
    cover_image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=80&h=60&fit=crop",
    hotel_name: "Royal Dhaka Tower",
    city: "Dhaka",
    country: "Bangladesh",
    default_rating: 4.6,
    no_of_rooms: 200,
    status: true,
  },
  {
    id: "5",
    cover_image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=60&fit=crop",
    hotel_name: "Sundarbans Eco Lodge",
    city: "Khulna",
    country: "Bangladesh",
    default_rating: 4.0,
    no_of_rooms: 30,
    status: true,
  },
  {
    id: "6",
    cover_image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=80&h=60&fit=crop",
    hotel_name: "Chittagong Bay Hotel",
    city: "Chittagong",
    country: "Bangladesh",
    default_rating: 3.9,
    no_of_rooms: 60,
    status: false,
  },
  {
    id: "7",
    cover_image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=80&h=60&fit=crop",
    hotel_name: "Rajshahi Heritage Inn",
    city: "Rajshahi",
    country: "Bangladesh",
    default_rating: 4.1,
    no_of_rooms: 50,
    status: true,
  },
  {
    id: "8",
    cover_image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=80&h=60&fit=crop",
    hotel_name: "Padma River Resort",
    city: "Faridpur",
    country: "Bangladesh",
    default_rating: 4.3,
    no_of_rooms: 40,
    status: true,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────
export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelRow[]>(DEMO_HOTELS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const totalHotels = hotels.length;
  const activeHotels = hotels.filter((h) => h.status).length;

  // Filters
  const filtered = hotels.filter((h) => {
    const locMatch = locationFilter
      ? h.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        h.country.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const statusMatch =
      statusFilter === "active"
        ? h.status
        : statusFilter === "inactive"
          ? !h.status
          : true;
    return locMatch && statusMatch;
  });

  // Table columns
  const columns: Column<HotelRow>[] = [
    {
      key: "cover_image",
      title: "Featured Image",
      render: (row) => (
        <div className='w-16 h-12 rounded-sm overflow-hidden border border-[#cec1c1] flex-shrink-0'>
          <Image
            src={row.cover_image}
            alt={row.hotel_name}
            width={64}
            height={48}
            className='w-full h-full object-cover'
          />
        </div>
      ),
    },
    {
      key: "hotel_name",
      title: "Hotel Name",
      sortable: true,
      render: (row) => (
        <span className='font-medium text-[#201818]'>{row.hotel_name}</span>
      ),
    },
    {
      key: "city",
      title: "Location",
      sortable: true,
      render: (row) => (
        <span className='text-[#4d3e3e]'>
          {row.city}, {row.country}
        </span>
      ),
    },
    {
      key: "default_rating",
      title: "Rating",
      sortable: true,
      render: (row) => (
        <span className='flex items-center gap-1 text-[#4d3e3e]'>
          <Star size={12} className='text-amber-400 fill-amber-400' />
          {row.default_rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <StatusBadge
          value={row.status}
          onChange={() =>
            setHotels((prev) =>
              prev.map((h) =>
                h.id === row.id ? { ...h, status: !h.status } : h,
              ),
            )
          }
        />
      ),
    },
  ];

  const actions: TableAction<HotelRow>[] = [
    {
      label: "View",
      variant: "view",
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Edit",
      variant: "edit",
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "Delete",
      variant: "delete",
      onClick: (row) => setHotels((p) => p.filter((h) => h.id !== row.id)),
    },
  ];

  return (
    <div className='space-y-5'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-1.5 text-xs text-[#7f6b6b]'>
        <span>Home</span>
        <ChevronRight size={12} />
        <span className='text-[#411818] font-medium'>Hotel</span>
      </div>

      {/* Page header */}
      <div>
        <h1 className='text-xl font-bold text-[#201818]'>Hotels</h1>
        <p className='text-xs text-[#7f6b6b] mt-0.5'>Manage your hotels</p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 gap-4 max-w-sm'>
        <StatCard label='Total Hotels' value={totalHotels} icon={Building2} />
        <StatCard label='Active' value={activeHotels} icon={CheckCircle} />
      </div>

      {/* Filter + Add button row */}
      <div className='flex items-center gap-3'>
        <p className='text-xs text-[#7f6b6b]'>
          Total Hotels:{" "}
          <span className='font-semibold text-[#201818]'>
            {filtered.length}
          </span>
        </p>

        <div className='flex items-center gap-2 ml-auto'>
          {/* Location filter */}
          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder='Location'
            className='text-xs border border-[#cec1c1] rounded-sm px-3 py-1.5 bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-1 focus:ring-[#411818]/30 w-36'
          />

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='text-xs border border-[#cec1c1] rounded-sm px-3 py-1.5 bg-[#fffef4] text-[#4d3e3e] focus:outline-none focus:ring-1 focus:ring-[#411818]/30'>
            <option value=''>Status</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>

          {/* Add Hotel button */}
          <button
            onClick={() => setShowAddForm(true)}
            className='flex items-center gap-1.5 px-4 py-1.5 bg-[#411818] text-white text-xs font-semibold rounded-sm hover:bg-[#5a2020] transition-colors'>
            <Plus size={13} />
            Add Hotel
          </button>
        </div>
      </div>

      {/* Table */}
      <UniversalTable
        data={filtered}
        columns={columns}
        actions={actions}
        rowKey={(row: { id: any }) => row.id}
        pageSize={6}
        searchable={true}
        searchPlaceholder='Search hotels...'
        emptyText='No hotels found.'
      />

      {/* Add Hotel Modal */}
      {showAddForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4'>
          <div className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <AddHotelForm onClose={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
