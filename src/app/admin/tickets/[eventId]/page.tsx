'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { Loader2, ArrowLeft, Ticket, Users, ScanLine, Tag } from 'lucide-react';

interface Category {
  index: number;
  name: string;
  price: number;
  totalSeats: number;
  available: number;
  sold: number;
  scanned: number;
}

interface DetailData {
  event: {
    id: number;
    title: { en: string; fr: string };
    coverImage?: string;
    bannerSquare?: string;
    bannerLandscape?: string;
    startDate: string;
    venue: { en: string; fr: string };
  };
  stats: {
    totalTickets: number;
    soldTickets: number;
    peopleEntered: number;
  };
  categories: Category[];
}

export default function TicketDetailPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/admin/${params.eventId}/tickets-detail`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params.eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Ticket className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Event not found.</p>
      </div>
    );
  }

  const { event, stats, categories } = data;
  const bannerSrc = getImageUrl(event.bannerSquare || event.bannerLandscape || event.coverImage, '');
  const eventTitle = event.title?.en || event.title?.fr || '';

  return (
    <div className="p-0 lg:p-0">

      {/* ── Banner Hero ─────────────────────────────────────────── */}
      <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
        {bannerSrc ? (
          <img src={bannerSrc} alt={eventTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#112b38] to-[#1a3f50]" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content on banner */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-6">
          <p className="text-[#c89c6b] text-xs font-semibold uppercase tracking-widest mb-1">
            Tickets Overview &amp; Management
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase leading-tight mb-4">
            {eventTitle}
          </h1>
          <button
            onClick={() => router.push('/admin/tickets')}
            className="flex items-center gap-2 bg-[#c89c6b] hover:bg-[#b8885a] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">

        {/* ── Stats Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Tickets"
            value={stats.totalTickets}
            icon={<Ticket className="w-5 h-5" />}
            color="text-gray-700"
          />
          <StatCard
            label="Sold Tickets"
            value={stats.soldTickets}
            icon={<Tag className="w-5 h-5" />}
            color="text-[#c89c6b]"
          />
          <StatCard
            label="People Entered"
            value={stats.peopleEntered}
            icon={<ScanLine className="w-5 h-5" />}
            color="text-green-600"
          />
        </div>

        {/* ── Tickets per Category ────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-[#c89c6b] flex items-center justify-center flex-shrink-0">
              <Ticket className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#112b38]">Tickets per Category</h2>
          </div>

          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm">No ticket categories defined.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => {
                const soldPct = cat.totalSeats > 0 ? Math.round((cat.sold / cat.totalSeats) * 100) : 0;
                return (
                  <div key={cat.index} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-[#112b38] text-base">{cat.name}</h3>
                      <span className="text-xs font-semibold bg-[#112b38]/10 text-[#112b38] px-2 py-0.5 rounded-full whitespace-nowrap">
                        Rs {cat.price}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#c89c6b] transition-all duration-500"
                        style={{ width: `${soldPct}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-gray-800">{cat.totalSeats}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sold</p>
                        <p className="font-bold text-[#c89c6b]">{cat.sold}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Scanned</p>
                        <p className="font-bold text-green-600">{cat.scanned}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>{cat.available} remaining</span>
                      <span className="font-semibold text-[#c89c6b]">{soldPct}% sold</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Grand Total ─────────────────────────────────────────── */}
        {categories.length > 0 && (
          <div className="bg-[#112b38] text-white rounded-2xl px-6 py-4 flex items-center justify-between">
            <span className="font-semibold text-sm">Grand Total Revenue</span>
            <span className="text-xl font-extrabold text-[#c89c6b]">
              Rs {categories.reduce((s, c) => s + c.sold * c.price, 0).toLocaleString()}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, color,
}: {
  label: string; value: number; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
        <span className={color}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
