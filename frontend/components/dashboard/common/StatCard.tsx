import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className='bg-white border border-[#cec1c1] rounded-sm p-5 flex items-center gap-4'>
      <div className='w-11 h-11 rounded-sm bg-[#411818]/8 flex items-center justify-center flex-shrink-0'>
        <Icon size={20} className='text-[#411818]' />
      </div>
      <div>
        <p className='text-xs text-[#7f6b6b] font-medium uppercase tracking-wide'>
          {label}
        </p>
        <p className='text-2xl font-bold text-[#201818] mt-0.5'>{value}</p>
      </div>
    </div>
  );
}
