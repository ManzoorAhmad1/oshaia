'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, FileBarChart, TrendingUp, ShoppingCart, CheckCircle } from 'lucide-react';

interface BookingRow {
  id: number;
  bookingRef: string;
  eventId: number;
  totalAmount: number;
  paymentStatus: string;
  buyerName: string;
  buyerEmail: string;
  createdAt: string;
  items: any[];
}

interface EventRow { id: number; title: { en: string; fr: string }; }

interface EventStat {
  eventId: number;
  eventTitle: string;
  totalBookings: number;
  paidBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  paidRevenue: number;
}

export default function SalesPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/admin/all'),
      api.get('/events/admin/all'),
    ])
      .then(([bRes, eRes]) => {
        setBookings(bRes.data.bookings || []);
        setEvents(eRes.data.events || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const eventMap: Record<number, string> = {};
  events.forEach(e => { eventMap[e.id] = e.title?.en || e.title?.fr || `Event #${e.id}`; });

  const statsMap: Record<number, EventStat> = {};
  bookings.forEach(b => {
    if (!statsMap[b.eventId]) {
      statsMap[b.eventId] = {
        eventId: b.eventId,
        eventTitle: eventMap[b.eventId] || `Event #${b.eventId}`,
        totalBookings: 0, paidBookings: 0, pendingBookings: 0,
        totalRevenue: 0, paidRevenue: 0,
      };
    }
    const s = statsMap[b.eventId];
    s.totalBookings++;
    s.totalRevenue += Number(b.totalAmount) || 0;
    if (b.paymentStatus === 'paid') { s.paidBookings++; s.paidRevenue += Number(b.totalAmount) || 0; }
    if (b.paymentStatus === 'pending') s.pendingBookings++;
  });

  const rows = Object.values(statsMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  const totalRevenue = bookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const paidRevenue  = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <FileBarChart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Sales Report</h1>
          <p className="text-sm text-gray-500">Booking & revenue breakdown per event</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Total Bookings" value={bookings.length} color="text-gray-800" icon={<ShoppingCart className="w-4 h-4" />} />
            <StatCard label="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} color="text-[#c89c6b]" icon={<TrendingUp className="w-4 h-4" />} />
            <StatCard label="Paid Revenue" value={`Rs ${paidRevenue.toLocaleString()}`} color="text-green-600" icon={<CheckCircle className="w-4 h-4" />} />
            <StatCard label="Pending" value={bookings.filter(b => b.paymentStatus === 'pending').length} color="text-orange-500" icon={<ShoppingCart className="w-4 h-4" />} />
          </div>

          {/* Per-event table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {rows.length === 0 ? (
              <div className="py-20 text-center">
                <FileBarChart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No bookings yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Event</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Bookings</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Paid</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Pending</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Revenue</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Paid Rev.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map(r => (
                      <tr key={r.eventId} className="hover:bg-gray-50">
                        <td className="px-5 py-3.5 font-semibold text-[#112b38]">{r.eventTitle}</td>
                        <td className="px-5 py-3.5 font-bold text-gray-700">{r.totalBookings}</td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-green-600">{r.paidBookings}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-orange-500">{r.pendingBookings}</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-800">Rs {r.totalRevenue.toLocaleString()}</td>
                        <td className="px-5 py-3.5 font-bold text-green-600">Rs {r.paidRevenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
