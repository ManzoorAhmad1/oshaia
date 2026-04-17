'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Globe, EyeOff, Loader2, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  _id?: string;
  title: { en: string; fr: string };
  category: string;
  startDate: string;
  isPublic: boolean;
  badge: string;
  coverImage: string;
}

const CATEGORIES = ['all', 'concert', 'festival', 'conferences', 'show', 'sport'];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">No events found.</td>
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
  );
}
