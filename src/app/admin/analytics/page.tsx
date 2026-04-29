'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, BarChart3, Calendar, Ticket, Users } from 'lucide-react';

const BAR_COLORS = ['#c89c6b', '#2a6b8a', '#e8b87a', '#1a4a60', '#d4a06a', '#3a7a9a'];

export default function AnalyticsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/events/admin/all'),
      api.get('/bookings/admin/all'),
      api.get('/admin/users'),
    ])
      .then(([eRes, bRes, uRes]) => {
        setEvents(eRes.data.events || []);
        setBookings(bRes.data.bookings || []);
        setUsers(uRes.data.users || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Events by category
  const catMap: Record<string, number> = {};
  events.forEach(e => { catMap[e.category || 'other'] = (catMap[e.category || 'other'] || 0) + 1; });
  const maxCat = Math.max(...Object.values(catMap), 1);

  // Top events by sold tickets
  const eventSales: Record<number, { title: string; sold: number }> = {};
  events.forEach(e => {
    const sold = (e.ticketTypes || []).reduce((s: number, t: any) => s + ((t.totalSeats || 0) - (t.availableSeats || 0)), 0);
    eventSales[e.id] = { title: e.title?.en || e.title?.fr || `#${e.id}`, sold };
  });
  const topEvents = Object.values(eventSales).sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = Math.max(...topEvents.map(e => e.sold), 1);

  // Bookings by month
  const monthMap: Record<string, number> = {};
  bookings.forEach(b => {
    const key = new Date(b.createdAt).toLocaleString('en', { month: 'short', year: '2-digit' });
    monthMap[key] = (monthMap[key] || 0) + 1;
  });
  const monthRows = Object.entries(monthMap).slice(-6);
  const maxMonth = Math.max(...monthRows.map(([, v]) => v), 1);

  const paid    = bookings.filter(b => b.paymentStatus === 'paid').length;
  const pending = bookings.filter(b => b.paymentStatus === 'pending').length;
  const convRate = bookings.length > 0 ? Math.round((paid / bookings.length) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Analytics</h1>
          <p className="text-sm text-gray-500">Platform performance overview</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Events', value: events.length, icon: <Calendar className="w-4 h-4" />, color: 'text-[#112b38]' },
              { label: 'Total Bookings', value: bookings.length, icon: <Ticket className="w-4 h-4" />, color: 'text-[#c89c6b]' },
              { label: 'Total Users', value: users.length, icon: <Users className="w-4 h-4" />, color: 'text-blue-600' },
              { label: 'Conversion Rate', value: `${convRate}%`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-green-600' },
            ].map(k => (
              <div key={k.label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 ${k.color}`}>{k.icon}</div>
                <div>
                  <p className="text-xs text-gray-500">{k.label}</p>
                  <p className={`text-xl font-extrabold ${k.color}`}>{k.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Events by category */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Events by Category</h2>
              {Object.keys(catMap).length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No events yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(catMap).map(([cat, count], i) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="capitalize text-gray-600 font-medium">{cat}</span>
                        <span className="font-bold text-[#112b38]">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className="h-2.5 rounded-full transition-all" style={{ width: `${(count / maxCat) * 100}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top events by sold tickets */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Top Events by Sold Tickets</h2>
              {topEvents.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No ticket data yet</p>
              ) : (
                <div className="space-y-3">
                  {topEvents.map((e, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="text-gray-700 font-medium truncate max-w-[200px]">{e.title}</span>
                        <span className="font-bold text-[#112b38] ml-2">{e.sold}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full bg-[#c89c6b] transition-all" style={{ width: `${(e.sold / maxSold) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings by month */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Bookings by Month</h2>
              {monthRows.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
              ) : (
                <div className="flex items-end gap-2 h-32">
                  {monthRows.map(([month, count]) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-[#112b38]">{count}</span>
                      <div className="w-full rounded-t-md bg-[#c89c6b]" style={{ height: `${(count / maxMonth) * 80}px`, minHeight: 4 }} />
                      <span className="text-xs text-gray-500 whitespace-nowrap">{month}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment funnel */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Payment Funnel</h2>
              <div className="space-y-4">
                {[
                  { label: 'Total Bookings', value: bookings.length, color: 'bg-[#112b38]' },
                  { label: 'Paid', value: paid, color: 'bg-green-500' },
                  { label: 'Pending', value: pending, color: 'bg-yellow-400' },
                  { label: 'Conversion', value: `${convRate}%`, color: 'bg-[#c89c6b]' },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${f.color}`} />
                      <span className="text-sm text-gray-600">{f.label}</span>
                    </div>
                    <span className="font-bold text-gray-800">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
