"use client";

import { Column, TableAction } from "@/components/universaltable/Table.Types";
import UniversalTable, {
  StatusBadge,
} from "@/components/universaltable/Universaltable";
import {
  useDeleteHotelMutation,
  useGetOwnedHotelsQuery,
} from "@/service/hotel/Hotel";
import {
  Building2,
  CheckCircle,
  ChevronRight,
  Loader2,
  Plus,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import StatCard from "../../common/StatCard";
import AddHotelForm from "./AddHotelForm";
import HotelFormModal from "./HotelFormModal";

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

// ── Page ──────────────────────────────────────────────────────────────────
export default function HotelsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | null>(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      city: locationFilter || undefined,
    }),
    [searchQuery, locationFilter],
  );

  const {
    data: hotelsData,
    isLoading,
    isError,
  } = useGetOwnedHotelsQuery(queryParams);

  const [deleteHotel] = useDeleteHotelMutation();

  const hotels = (hotelsData?.data?.items || []) as HotelRow[];
  console.log("🏨 Hotels data for table:", {
    totalHotels: hotels.length,
    isLoading,
    isError,
    data: hotels,
  });
  const totalHotels = hotelsData?.data?.pagination?.total || 0;
  // Note: Backend might not return status-based count in findAll,
  // we'll use activeHotels from the current page items as a fallback or just show total.
  const activeHotels = hotels.filter((h) => h.status !== false).length;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    const toastId = toast.loading("Deleting hotel...");
    try {
      await deleteHotel(id).unwrap();
      toast.success("Hotel deleted successfully", { id: toastId });
    } catch (error: any) {
      console.error("❌ Delete error:", error);
      toast.error(
        error?.data?.message || "Failed to delete hotel. Please try again.",
        { id: toastId },
      );
    }
  };

  // Table columns
  const columns: Column<HotelRow>[] = [
    {
      key: "cover_image",
      title: "Featured Image",
      render: (row) => (
        <div className='w-14 h-10 sm:w-16 sm:h-12 rounded-sm overflow-hidden border border-[#cec1c1] shrink-0'>
          <Image
            src={
              row.cover_image ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop"
            }
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
        <span className='font-medium text-[#201818] text-xs sm:text-sm'>
          {row.hotel_name}
        </span>
      ),
    },
    {
      key: "city",
      title: "Location",
      sortable: true,
      render: (row) => (
        <span className='text-[#4d3e3e] text-[11px] sm:text-xs'>
          {row.city}, {row.country}
        </span>
      ),
    },
    {
      key: "default_rating",
      title: "Rating",
      sortable: true,
      render: (row) => (
        <span className='flex items-center gap-1 text-[#4d3e3e] text-[11px] sm:text-xs'>
          <Star size={12} className='text-amber-400 fill-amber-400' />
          {row.default_rating?.toFixed(1) || "0.0"}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <StatusBadge
          value={row.status !== false}
          onChange={() => toast.info("Status update functionality coming soon")}
        />
      ),
    },
  ];

  const actions: TableAction<HotelRow>[] = [
    {
      label: "View",
      variant: "view",
      onClick: (row) => {
        console.log("👁️ View hotel:", row.id);
        setSelectedHotelId(row.id);
        setModalMode("view");
      },
    },
    {
      label: "Edit",
      variant: "edit",
      onClick: (row) => {
        console.log("✏️ Edit hotel:", row.id);
        setSelectedHotelId(row.id);
        setModalMode("edit");
      },
    },
    {
      label: "Delete",
      variant: "delete",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <div className='space-y-6 pb-10'>
      {/* Breadcrumb */}
      <div className='flex items-center gap-1.5 text-[10px] sm:text-xs text-[#7f6b6b]'>
        <span>Home</span>
        <ChevronRight size={12} />
        <span className='text-[#411818] font-medium'>Hotels</span>
      </div>

      {/* Page header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-xl sm:text-2xl font-bold text-[#201818]'>
            Hotels
          </h1>
          <p className='text-xs text-[#7f6b6b] mt-0.5'>
            Manage your hotel properties
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className='flex items-center justify-center gap-1.5 px-4 py-2 bg-[#411818] text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-[#5a2020] transition-all shadow-sm'>
          <Plus size={14} />
          Add Hotel
        </button>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard label='Total Hotels' value={totalHotels} icon={Building2} />
        <StatCard
          label='Active Hotels'
          value={activeHotels}
          icon={CheckCircle}
        />
      </div>

      {/* Filter row */}
      <div className='flex flex-col lg:flex-row lg:items-center gap-4 bg-surface p-4 rounded-xl border border-card shadow-sm'>
        <div className='flex-1 relative'>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by name, address...'
            className='w-full text-xs sm:text-sm border border-[#cec1c1] rounded-lg px-4 py-2.5 bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-2 focus:ring-[#411818]/20 transition-all'
          />
        </div>

        <div className='flex items-center gap-3'>
          <input
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder='Filter by city'
            className='text-xs sm:text-sm border border-[#cec1c1] rounded-lg px-3 py-2.5 bg-[#fffef4] text-[#4d3e3e] placeholder:text-[#b6a5a5] focus:outline-none focus:ring-2 focus:ring-[#411818]/20 w-32 sm:w-40'
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='text-xs sm:text-sm border border-[#cec1c1] rounded-lg px-3 py-2.5 bg-[#fffef4] text-[#4d3e3e] focus:outline-none focus:ring-2 focus:ring-[#411818]/20 cursor-pointer'>
            <option value=''>All Status</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className='bg-surface rounded-xl border border-card shadow-sm overflow-hidden'>
        {isLoading ? (
          <div className='py-20 flex flex-col items-center justify-center gap-3'>
            <Loader2 className='w-8 h-8 animate-spin text-[#411818]' />
            <p className='text-xs text-muted font-medium'>Loading hotels...</p>
          </div>
        ) : isError ? (
          <div className='py-20 text-center text-red-500'>
            <p className='font-medium'>Failed to load hotels.</p>
            <button
              onClick={() => window.location.reload()}
              className='text-xs underline mt-2'>
              Retry
            </button>
          </div>
        ) : (
          <UniversalTable
            data={hotels}
            columns={columns}
            actions={actions}
            rowKey={(row) => row.id}
            pageSize={10}
            searchable={false} // Using our custom search bar above
            emptyText='No hotels found. Start by adding your first property!'
          />
        )}
      </div>

      {/* Add Hotel Modal */}
      {showAddForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto'>
          <div className='w-full max-w-2xl my-auto'>
            <AddHotelForm
              onClose={() => {
                console.log("📤 Closing modal...");
                setShowAddForm(false);
              }}
            />
          </div>
        </div>
      )}

      {/* View/Edit Hotel Modal */}
      {selectedHotelId && modalMode && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto'>
          <div className='w-full max-w-2xl my-auto'>
            <HotelFormModal
              hotelId={selectedHotelId}
              mode={modalMode}
              onClose={() => {
                console.log("📤 Closing form modal...");
                setSelectedHotelId(null);
                setModalMode(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
