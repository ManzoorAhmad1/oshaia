'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Ticket, QrCode, Search } from 'lucide-react';

interface IssuedTicket {
  id: string;
  serialNumber?: string;
  ticketType?: string;
  seatNumber?: string;
  status: 'valid' | 'used' | 'cancelled';
  user?: { name: string; email: string };
  event?: { title: { en: string } };
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  valid:     'bg-green-100 text-green-700',
  used:      'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
};

export default function TicketsPage() {
  const [tickets, setTickets]  = useState<IssuedTicket[]>([]);
  const [loading, setLoading]  = useState(true);
  const [search, setSearch]    = useState('');

  useEffect(() => {
    api.get('/tickets/admin/all')
      .then(res => setTickets(res.data.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter(t =>
    t.serialNumber?.toLowerCase().includes(search.toLowerCase()) ||
    t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.event?.title?.en?.toLowerCase().includes(search.toLowerCase()) ||
    t.ticketType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">All issued tickets with QR codes</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Valid: {tickets.filter(t => t.status === 'valid').length}
          </span>
          <span className="flex items-center gap-1 ml-3">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Used: {tickets.filter(t => t.status === 'used').length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by serial, buyer, event, type..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Ticket className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No tickets issued yet</p>
            <p className="text-sm text-gray-400 mt-1">Tickets are generated after successful payment</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Serial #</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Holder</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Seat</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">QR</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Issued</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 font-semibold">{t.serialNumber || '—'}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{t.user?.name || '—'}</p>
                      <p className="text-xs text-gray-500">{t.user?.email || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{t.event?.title?.en || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-[#c89c6b]/10 text-[#112b38] rounded text-xs font-medium">
                        {t.ticketType || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.seatNumber || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[t.status] || 'bg-gray-100 text-gray-600'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <QrCode className="w-5 h-5 text-[#112b38]" />
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
