'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import {
  Loader2, ArrowLeft, Ticket, Users, ScanLine, Tag,
  Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  CheckCircle2, XCircle, Clock, Filter,
} from 'lucide-react';

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

interface TicketRow {
  id: number;
  serialNumber: string;
  ticketTypeName: string;
  ticketTypeIndex: number;
  price: number;
  status: 'available' | 'valid' | 'used' | 'cancelled';
  scannedAt: string | null;
  createdAt: string;
  buyer?: { id: number; name: string; email: string; phone?: string };
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-gray-50 text-gray-500 border border-gray-200',
  valid:     'bg-blue-50 text-blue-700 border border-blue-200',
  used:      'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-600 border border-red-200',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  available: <Ticket className="w-3 h-3" />,
  valid:     <Clock className="w-3 h-3" />,
  used:      <CheckCircle2 className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

export default function TicketDetailPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Tickets list state ──────────────────────────────────────────────────
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [customLimit, setCustomLimit] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // ── Fetch summary ───────────────────────────────────────────────────────
  useEffect(() => {
    api.get(`/events/admin/${params.eventId}/tickets-detail`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [params.eventId]);

  // ── Fetch paginated tickets ─────────────────────────────────────────────
  const fetchTickets = useCallback(() => {
    setTicketsLoading(true);
    const q: Record<string, any> = { page, limit };
    if (search) q.search = search;
    if (statusFilter) q.status = statusFilter;
    if (categoryFilter !== '') q.category = categoryFilter;
    api.get(`/events/admin/${params.eventId}/tickets-list`, { params: q })
      .then(res => {
        setTickets(res.data.tickets ?? []);
        setTotal(res.data.total ?? 0);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch(() => setTickets([]))
      .finally(() => setTicketsLoading(false));
  }, [params.eventId, page, limit, search, statusFilter, categoryFilter]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, statusFilter, categoryFilter, limit]);

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

  const applyCustomLimit = () => {
    const n = parseInt(customLimit, 10);
    if (n > 0 && n <= 500) { setLimit(n); setShowCustomInput(false); setCustomLimit(''); }
  };

  return (
    <div className="p-0 lg:p-0">

      {/* ── Banner Hero ─────────────────────────────────────────── */}
      <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
        {bannerSrc ? (
          <img src={bannerSrc} alt={eventTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#112b38] to-[#1a3f50]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
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
          <StatCard label="Total Tickets" value={stats.totalTickets} icon={<Ticket className="w-5 h-5" />} color="text-gray-700" />
          <StatCard label="Sold Tickets"  value={stats.soldTickets}  icon={<Tag className="w-5 h-5" />}    color="text-[#c89c6b]" />
          <StatCard label="People Entered" value={stats.peopleEntered} icon={<ScanLine className="w-5 h-5" />} color="text-green-600" />
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
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                      <div className="h-full rounded-full bg-[#c89c6b] transition-all duration-500" style={{ width: `${soldPct}%` }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><p className="text-xs text-gray-500">Total</p><p className="font-bold text-gray-800">{cat.totalSeats}</p></div>
                      <div><p className="text-xs text-gray-500">Sold</p><p className="font-bold text-[#c89c6b]">{cat.sold}</p></div>
                      <div><p className="text-xs text-gray-500">Scanned</p><p className="font-bold text-green-600">{cat.scanned}</p></div>
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

        {/* ── Individual Tickets List ──────────────────────────────── */}
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#112b38] flex items-center justify-center flex-shrink-0">
                <Users className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-lg font-bold text-[#112b38]">
                All Tickets
                <span className="ml-2 text-sm font-normal text-gray-400">({total.toLocaleString()} total)</span>
              </h2>
            </div>

            {/* Page size selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 whitespace-nowrap">Show per page:</span>
              <div className="flex items-center gap-1">
                {PAGE_SIZE_OPTIONS.map(n => (
                  <button
                    key={n}
                    onClick={() => { setLimit(n); setShowCustomInput(false); }}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors border ${
                      limit === n && !showCustomInput
                        ? 'bg-[#112b38] text-white border-[#112b38]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#c89c6b]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setShowCustomInput(v => !v)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors border ${
                    showCustomInput
                      ? 'bg-[#c89c6b] text-white border-[#c89c6b]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#c89c6b]'
                  }`}
                >
                  Custom
                </button>
                {showCustomInput && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number" min="1" max="500"
                      value={customLimit}
                      onChange={e => setCustomLimit(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && applyCustomLimit()}
                      placeholder="e.g. 200"
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                    />
                    <button onClick={applyCustomLimit} className="px-2 py-1 text-xs bg-[#112b38] text-white rounded-lg hover:bg-[#0d2030]">
                      Go
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') setSearch(searchInput); }}
                onBlur={() => setSearch(searchInput)}
                placeholder="Search serial, ticket type…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c89c6b] bg-white"
              />
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
              >
                <option value="">All Status</option>
                <option value="available">Available (Pre-generated)</option>
                <option value="valid">Valid (Booked)</option>
                <option value="used">Scanned / Used</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Category filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.index} value={String(cat.index)}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {ticketsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-[#c89c6b]" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Ticket className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No tickets found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#112b38] text-white text-xs uppercase tracking-wide">
                      <th className="px-4 py-3 text-left font-semibold">#</th>
                      <th className="px-4 py-3 text-left font-semibold">Serial No.</th>
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <th className="px-4 py-3 text-right font-semibold">Price</th>
                      <th className="px-4 py-3 text-left font-semibold">Buyer</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Booked At</th>
                      <th className="px-4 py-3 text-left font-semibold">Scanned At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tickets.map((tk, i) => (
                      <tr key={tk.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                          {(page - 1) * limit + i + 1}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-[#112b38] font-semibold whitespace-nowrap">
                          {tk.serialNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-[#c89c6b]/10 text-[#112b38] text-xs font-semibold">
                            {tk.ticketTypeName || `Type ${tk.ticketTypeIndex + 1}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#c89c6b] whitespace-nowrap">
                          Rs {Number(tk.price).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 min-w-[160px]">
                          {tk.buyer ? (
                            <div>
                              <p className="font-semibold text-[#112b38] text-xs">{tk.buyer.name}</p>
                              <p className="text-gray-400 text-[11px]">{tk.buyer.email}</p>
                              {tk.buyer.phone && <p className="text-gray-400 text-[11px]">{tk.buyer.phone}</p>}
                            </div>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLES[tk.status]}`}>
                            {STATUS_ICONS[tk.status]}
                            {tk.status.charAt(0).toUpperCase() + tk.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {tk.createdAt ? new Date(tk.createdAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-green-600 whitespace-nowrap">
                          {tk.scannedAt ? new Date(tk.scannedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Pagination ────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-[#112b38]">{((page - 1) * limit) + 1}</span>–<span className="font-semibold text-[#112b38]">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-[#112b38]">{total.toLocaleString()}</span> tickets
              </p>

              <div className="flex items-center gap-1">
                <PagBtn onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft className="w-4 h-4" /></PagBtn>
                <PagBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></PagBtn>

                {/* Page number pills */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) { p = i + 1; }
                  else if (page <= 3) { p = i + 1; }
                  else if (page >= totalPages - 2) { p = totalPages - 4 + i; }
                  else { p = page - 2 + i; }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                        page === p
                          ? 'bg-[#112b38] text-white'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-[#c89c6b]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <PagBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></PagBtn>
                <PagBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRight className="w-4 h-4" /></PagBtn>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function PagBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#c89c6b] hover:text-[#c89c6b] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
    >
      {children}
    </button>
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
