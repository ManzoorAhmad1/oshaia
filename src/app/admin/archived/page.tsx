'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { Loader2, Archive, RotateCcw, Trash2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface EventRow {
  id: number;
  title: { en: string; fr: string };
  category: string;
  startDate: string;
  coverImage?: string;
  isPublic: boolean;
}

export default function ArchivedPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.get('/events/admin/archived')
      .then(res => setEvents(res.data.events || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const restore = async (id: number) => {
    setActionId(id);
    try {
      await api.patch(`/events/admin/${id}/restore`);
      toast.success('Event restored');
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch { toast.error('Failed to restore'); }
    finally { setActionId(null); }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <Archive className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Archived Events</h1>
          <p className="text-sm text-gray-500">Past and deleted events — restore or permanently remove</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Archive className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No archived events</p>
            <p className="text-xs text-gray-400 mt-1">Deleted events will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Event</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Category</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Date</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {ev.coverImage && (
                          <img src={getImageUrl(ev.coverImage)} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        )}
                        <span className="font-semibold text-gray-700">{ev.title?.en || ev.title?.fr}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">{ev.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(ev.startDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={actionId === ev.id}
                          onClick={() => restore(ev.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-green-500 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionId === ev.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                          Restore
                        </button>
                      </div>
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
