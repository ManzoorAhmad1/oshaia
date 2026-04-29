'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { Loader2, TrendingUp, Ticket, Calendar, Eye } from 'lucide-react';

export default function GrowthPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/admin/all?limit=1000')
      .then(res => setEvents(res.data.events || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const rows = events.map(ev => {
    const types: any[] = ev.ticketTypes || [];
    const totalSeats = types.reduce((s, t) => s + (Number(t.totalSeats) || 0), 0);
    const soldSeats  = types.reduce((s, t) => s + ((Number(t.totalSeats) || 0) - (Number(t.availableSeats) || 0)), 0);
    const revenue    = types.reduce((s, t) => s + ((Number(t.totalSeats) || 0) - (Number(t.availableSeats) || 0)) * (Number(t.price) || 0), 0);
    const fillPct    = totalSeats > 0 ? Math.round((soldSeats / totalSeats) * 100) : 0;
    return { ev, totalSeats, soldSeats, revenue, fillPct };
  }).sort((a, b) => b.fillPct - a.fillPct);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Each Growth Event</h1>
          <p className="text-sm text-gray-500">Ticket sales progress and revenue per event</p>
        </div>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Total Events</p>
            <p className="text-2xl font-extrabold text-[#112b38]">{events.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Total Tickets Sold</p>
            <p className="text-2xl font-extrabold text-[#c89c6b]">{rows.reduce((s, r) => s + r.soldSeats, 0)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Est. Revenue</p>
            <p className="text-2xl font-extrabold text-green-600">Rs {rows.reduce((s, r) => s + r.revenue, 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          <TrendingUp className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No events yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ ev, totalSeats, soldSeats, revenue, fillPct }) => (
            <div key={ev.id} className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  {ev.coverImage && (
                    <img src={getImageUrl(ev.coverImage)} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-[#112b38]">{ev.title?.en || ev.title?.fr}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{new Date(ev.startDate).toLocaleDateString()}
                      <span className="ml-2 capitalize px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">{ev.category}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Total Seats</p>
                    <p className="font-bold text-gray-800">{totalSeats}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sold</p>
                    <p className="font-bold text-[#c89c6b]">{soldSeats}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="font-bold text-green-600">Rs {revenue.toLocaleString()}</p>
                  </div>
                  <button onClick={() => router.push(`/admin/tickets/${ev.id}`)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-[#c89c6b] text-[#c89c6b] rounded-lg text-xs font-semibold hover:bg-[#c89c6b] hover:text-white transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Fill Rate</span>
                  <span className="font-semibold text-[#c89c6b]">{fillPct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full bg-[#c89c6b] transition-all duration-500" style={{ width: `${fillPct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
