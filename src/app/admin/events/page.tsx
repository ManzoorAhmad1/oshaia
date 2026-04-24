'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Globe, EyeOff, Eye, Loader2, RefreshCw, Search, X, Tag, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

interface TicketTypeSummary {
  name: { en: string; fr: string };
  price: number;
  totalSeats: number;
  availableSeats?: number;
  expiryDate?: string;
}

interface Event {
  id: string;
  _id?: string;
  title: { en: string; fr: string };
  category: string;
  startDate: string;
  isPublic: boolean;
  badge: string;
  coverImage: string;
  ticketTypes?: TicketTypeSummary[];
}

const CATEGORIES = ['all', 'concert', 'festival', 'conferences', 'show', 'sport'];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewEvent, setPreviewEvent] = useState<Event | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (category !== 'all') params.category = category;
      if (search) params.search = search;
      const { data } = await api.get('/events/admin/all', { params });
      setEvents(data.events || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Real-time ticket count updates via socket
  useEffect(() => {
    import('@/lib/socket').then(({ getSocket }) => {
      const socket = getSocket();
      const handler = (data: { eventId: string; ticketTypes: TicketTypeSummary[] }) => {
        setEvents(prev => prev.map(e =>
          String(e.id) === String(data.eventId) ? { ...e, ticketTypes: data.ticketTypes } : e
        ));
      };
      socket.on('ticket:updated', handler);
      return () => { socket.off('ticket:updated', handler); };
    });
  }, []);

  const toggleVisibility = async (id: string) => {
    setTogglingId(id);
    try {
      const { data } = await api.patch(`/events/${id}/toggle-visibility`);
      setEvents((prev) => prev.map((e) => (String(e.id) === String(id) ? { ...e, isPublic: data.isPublic } : e)));
      toast.success(data.message);
    } catch {
      toast.error('Failed to toggle visibility');
    } finally {
      setTogglingId(null);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Events</h1>
          <p className="text-gray-500 text-sm mt-0.5">{events.length} events total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#112b38] text-white rounded-lg text-sm font-medium hover:bg-[#0d2030] transition-colors border border-[#c89c6b]/20"
        >
          <Plus className="w-4 h-4" /> Add Event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <button onClick={fetchEvents} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tickets</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No events found.</td>
                  </tr>
                )}
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {event.coverImage && (
                          <img
                            src={getImageUrl(event.coverImage)}
                            alt={event.title.en}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 leading-none">{event.title.en}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{event.title.fr || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-[#c89c6b]/10 text-[#112b38] rounded-full text-xs font-medium capitalize">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(event.startDate).toLocaleDateString()}
                    </td>
                    {/* Tickets remaining */}
                    <td className="px-4 py-3">
                      {event.ticketTypes?.length ? (
                        <div className="space-y-1">
                          {event.ticketTypes.map((tt, i) => {
                            const avail = tt.availableSeats ?? tt.totalSeats ?? 0;
                            const total = tt.totalSeats ?? 0;
                            const pct = total > 0 ? Math.round((avail / total) * 100) : 0;
                            const color = pct > 30 ? '#22c55e' : pct > 10 ? '#f59e0b' : '#ef4444';
                            const daysLeft = tt.expiryDate
                              ? Math.max(0, Math.ceil((new Date(tt.expiryDate).getTime() - Date.now()) / 86400000))
                              : null;
                            return (
                              <div key={i} className="text-xs">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-gray-700 font-medium truncate max-w-[90px]">{tt.name?.en || `#${i+1}`}</span>
                                  <span style={{ color }} className="font-bold whitespace-nowrap">{avail}/{total}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-0.5">
                                  <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
                                </div>
                                {daysLeft !== null && (
                                  <span className="text-gray-400 text-[10px]">{daysLeft}d left</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisibility(event.id)}
                        disabled={togglingId === (event.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          event.isPublic
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {togglingId === (event.id) ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : event.isPublic ? (
                          <Globe className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {event.isPublic ? 'Public' : 'Private'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewEvent(event)}
                          className="p-1.5 text-gray-500 hover:text-[#c89c6b] hover:bg-[#c89c6b]/10 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-[#112b38] hover:bg-[#c89c6b]/10 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          disabled={deletingId === (event.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          {deletingId === (event.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

      {/* Preview Modal */}
      {previewEvent && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover Image */}
            <div className="relative w-full h-48 rounded-t-2xl overflow-hidden bg-gray-100">
              {previewEvent.coverImage ? (
                <img
                  src={getImageUrl(previewEvent.coverImage)}
                  alt={previewEvent.title.en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Tag className="w-12 h-12" />
                </div>
              )}
              {/* Close btn */}
              <button
                onClick={() => setPreviewEvent(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {/* Badge */}
              <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-[#112b38]/80 text-white text-xs rounded-full capitalize">
                {previewEvent.category}
              </span>
              {/* Visibility */}
              <span className={`absolute bottom-3 right-3 px-2 py-0.5 text-xs rounded-full font-medium ${
                previewEvent.isPublic ? 'bg-green-500/90 text-white' : 'bg-orange-400/90 text-white'
              }`}>
                {previewEvent.isPublic ? 'Public' : 'Private'}
              </span>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <h2 className="text-lg font-bold text-[#112b38]">{previewEvent.title.en}</h2>
                {previewEvent.title.fr && (
                  <p className="text-sm text-gray-400 mt-0.5">{previewEvent.title.fr}</p>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#c89c6b] flex-shrink-0" />
                <span>{new Date(previewEvent.startDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Tickets */}
              {previewEvent.ticketTypes && previewEvent.ticketTypes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#112b38] mb-2">Ticket Types</h3>
                  <div className="space-y-3">
                    {previewEvent.ticketTypes.map((tt, i) => {
                      const avail = tt.availableSeats ?? tt.totalSeats ?? 0;
                      const total = tt.totalSeats ?? 0;
                      const pct = total > 0 ? Math.round((avail / total) * 100) : 0;
                      const color = pct > 30 ? '#22c55e' : pct > 10 ? '#f59e0b' : '#ef4444';
                      const daysLeft = tt.expiryDate
                        ? Math.max(0, Math.ceil((new Date(tt.expiryDate).getTime() - Date.now()) / 86400000))
                        : null;
                      return (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <span className="text-sm font-semibold text-[#112b38]">{tt.name?.en || `Type ${i + 1}`}</span>
                              {tt.name?.fr && <span className="text-xs text-gray-400 ml-2">{tt.name.fr}</span>}
                            </div>
                            <span className="text-sm font-bold text-[#c89c6b]">${tt.price ?? 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Available: <b style={{ color }}>{avail}</b> / {total}</span>
                            {daysLeft !== null && (
                              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                                daysLeft > 7 ? 'bg-green-100 text-green-700' : daysLeft > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-600'
                              }`}>
                                {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(!previewEvent.ticketTypes || previewEvent.ticketTypes.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-2">No ticket types found</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Link
                  href={`/admin/events/${previewEvent.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#112b38] text-white rounded-lg text-sm font-medium hover:bg-[#0d2030] transition-colors"
                  onClick={() => setPreviewEvent(null)}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Event
                </Link>
                <button
                  onClick={() => setPreviewEvent(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
