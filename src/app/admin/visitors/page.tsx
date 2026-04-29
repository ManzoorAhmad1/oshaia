'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Users, User, Search } from 'lucide-react';

interface BookingRow {
  id: number;
  eventId: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  totalAmount: number;
  paymentStatus: string;
  items: any[];
  createdAt: string;
}

interface EventRow { id: number; title: { en: string; fr: string }; }

export default function VisitorsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'buyers' | 'events'>('events');

  useEffect(() => {
    Promise.all([api.get('/bookings/admin/all'), api.get('/events/admin/all')])
      .then(([bRes, eRes]) => {
        setBookings(bRes.data.bookings || []);
        setEvents(eRes.data.events || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const eventMap: Record<number, string> = {};
  events.forEach(e => { eventMap[e.id] = e.title?.en || e.title?.fr || `Event #${e.id}`; });

  // Unique buyers
  const buyerMap: Record<string, { name: string; email: string; phone?: string; count: number; events: Set<number> }> = {};
  bookings.forEach(b => {
    const key = b.buyerEmail.toLowerCase();
    if (!buyerMap[key]) buyerMap[key] = { name: b.buyerName, email: b.buyerEmail, phone: b.buyerPhone, count: 0, events: new Set() };
    buyerMap[key].count++;
    buyerMap[key].events.add(b.eventId);
  });
  const buyers = Object.values(buyerMap).sort((a, b) => b.count - a.count);

  // Per-event buyer counts
  const eventBuyers: Record<number, Set<string>> = {};
  bookings.forEach(b => {
    if (!eventBuyers[b.eventId]) eventBuyers[b.eventId] = new Set();
    eventBuyers[b.eventId].add(b.buyerEmail.toLowerCase());
  });
  const eventRows = events
    .filter(e => eventBuyers[e.id])
    .map(e => ({
      id: e.id,
      title: e.title?.en || e.title?.fr || `Event #${e.id}`,
      uniqueBuyers: eventBuyers[e.id]?.size || 0,
      totalBookings: bookings.filter(b => b.eventId === e.id).length,
    }))
    .sort((a, b) => b.uniqueBuyers - a.uniqueBuyers);

  const filteredBuyers = buyers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <Users className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Visitors / Buyers Total</h1>
          <p className="text-sm text-gray-500">Unique buyers and attendance per event</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Unique Buyers</p>
              <p className="text-2xl font-extrabold text-[#112b38]">{buyers.length}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Total Bookings</p>
              <p className="text-2xl font-extrabold text-[#c89c6b]">{bookings.length}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Events with Buyers</p>
              <p className="text-2xl font-extrabold text-green-600">{Object.keys(eventBuyers).length}</p>
            </div>
          </div>

          {/* Tab toggle */}
          <div className="flex gap-2">
            {(['events', 'buyers'] as const).map(t => (
              <button key={t} onClick={() => setView(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  view === t ? 'bg-[#112b38] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {t === 'events' ? 'Per Event' : 'All Buyers'}
              </button>
            ))}
          </div>

          {view === 'events' ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              {eventRows.length === 0 ? (
                <div className="py-16 text-center text-gray-400">No events with bookings</div>
              ) : (
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Event</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Unique Buyers</th>
                    <th className="px-5 py-3 text-left font-semibold text-gray-600">Total Bookings</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {eventRows.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3.5 font-semibold text-[#112b38]">{r.title}</td>
                        <td className="px-5 py-3.5 font-bold text-[#c89c6b]">{r.uniqueBuyers}</td>
                        <td className="px-5 py-3.5 text-gray-700">{r.totalBookings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                {filteredBuyers.length === 0 ? (
                  <div className="py-16 text-center text-gray-400">No buyers found</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Buyer</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Email</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Bookings</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Events</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredBuyers.map((b, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#112b38] flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">{b.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="font-semibold text-gray-800">{b.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs">{b.email}</td>
                          <td className="px-5 py-3.5 font-bold text-[#c89c6b]">{b.count}</td>
                          <td className="px-5 py-3.5 text-gray-600">{b.events.size}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
