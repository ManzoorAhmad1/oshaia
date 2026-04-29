'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, Ticket, Eye } from 'lucide-react';

interface EventRow {
  id: number;
  title: { en: string; fr: string };
  totalTickets: number;
  soldTickets: number;
  peopleEntered: number;
}

export default function TicketsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/admin/tickets-summary')
      .then(res => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center flex-shrink-0">
          <Ticket className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#112b38]">Tickets Management</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Ticket className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No events found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold text-gray-600 w-full">Event</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 whitespace-nowrap">Total Tickets</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 whitespace-nowrap">Sold</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600 whitespace-nowrap">Scanned In</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {ev.title?.en || ev.title?.fr || '—'}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{ev.totalTickets}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${ev.soldTickets > 0 ? 'text-[#c89c6b]' : 'text-gray-400'}`}>
                      {ev.soldTickets}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${ev.peopleEntered > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {ev.peopleEntered}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/admin/tickets/${ev.id}`)}
                      className="flex items-center gap-1.5 px-4 py-1.5 border border-[#c89c6b] text-[#c89c6b] hover:bg-[#c89c6b] hover:text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
