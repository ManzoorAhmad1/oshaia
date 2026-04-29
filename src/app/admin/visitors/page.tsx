'use client';
import React from 'react';
import { Users } from 'lucide-react';
const ComingSoon = ({ title, desc, Icon }: { title: string; desc: string; Icon: any }) => (
  <div className="p-6 lg:p-8">
    <div className="mb-6"><h1 className="text-2xl font-bold text-[#112b38]">{title}</h1><p className="text-sm text-gray-500 mt-1">{desc}</p></div>
    <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center">
      <Icon className="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-400 mb-2">Coming Soon</h3>
      <p className="text-sm text-gray-400 max-w-xs mx-auto">Total visitors and buyers breakdown per event with demographic data.</p>
    </div>
  </div>
);
export default function VisitorsPage() {
  return <ComingSoon title="Visitors / Buyers Total" desc="Total visitor and buyer counts per event" Icon={Users} />;
}
