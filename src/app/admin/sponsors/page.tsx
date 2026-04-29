'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Users2, Ticket, Search } from 'lucide-react';

interface SponsorRow {
  eventId: number;
  eventTitle: string;
  sponsorName: string;
  ticketName: string;
  quantity: number;
  remarks: string;
}

export default function SponsorsPage() {
  const [rows, setRows] = useState<SponsorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/events/admin/all')
      .then(res => {
        const events: any[] = res.data.events || res.data || [];
        const extracted: SponsorRow[] = [];
        events.forEach(ev => {
          const sponsors: any[] = Array.isArray(ev.sponsorTickets) ? ev.sponsorTickets : [];
          sponsors.forEach(sp => {
            if (sp.sponsorName || sp.ticketName) {
              extracted.push({
                eventId: ev.id,
                eventTitle: ev.title?.en || ev.title?.fr || `Event #${ev.id}`,
                sponsorName: sp.sponsorName || '—',
                ticketName: sp.ticketName || '—',
                quantity: sp.quantity || 0,
                remarks: sp.remarks || '',
              });
            }
          });
        });
        setRows(extracted);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter(r =>
    r.sponsorName.toLowerCase().includes(search.toLowerCase()) ||
    r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.ticketName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center flex-shrink-0">
          <Users2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Sponsors</h1>
          <p className="text-sm text-gray-500">Event sponsors &amp; complimentary tickets</p>
        </div>
      </div>

      {/* Stats row */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Total Sponsors</p>
            <p className="text-2xl font-extrabold text-[#112b38]">{rows.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Total Comp Tickets</p>
            <p className="text-2xl font-extrabold text-[#c89c6b]">
              {rows.reduce((s, r) => s + (r.quantity || 0), 0)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-xs text-gray-500">Events with Sponsors</p>
            <p className="text-2xl font-extrabold text-green-600">
              {new Set(rows.map(r => r.eventId)).size}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by sponsor, event, or ticket name..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users2 className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">
              {rows.length === 0 ? 'No sponsors added yet' : 'No results found'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Add sponsors via Create/Edit Event → Sponsor Tickets section
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Sponsor Name</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Event</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Ticket Type</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Qty</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#112b38]">{r.sponsorName}</td>
                    <td className="px-5 py-3.5 text-gray-700">{r.eventTitle}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-[#112b38]">
                        <Ticket className="w-3.5 h-3.5 text-[#c89c6b]" />
                        {r.ticketName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-[#c89c6b]">{r.quantity}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs max-w-[200px] truncate">
                      {r.remarks || '—'}
                    </td>
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
