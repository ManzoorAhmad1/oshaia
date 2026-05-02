'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { Loader2, Ticket, Eye, RefreshCw, Users, ScanLine, TrendingUp, Activity } from 'lucide-react';

interface EventRow {
  id: number;
  title: { en: string; fr: string };
  totalTickets: number;
  soldTickets: number;
  peopleEntered: number;
  coverImage?: string;
  bannerSquare?: string;
  startDate?: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState('');

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get('/events/admin/tickets-summary');
      setEvents(res.data.events || []);
      setLastUpdated(new Date());
    } catch {
      if (!silent) setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchData(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleGenerateAll = async () => {
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await api.post('/events/admin/generate-all-tickets');
      setGenMsg(res.data.message || 'Done!');
    } catch {
      setGenMsg('Failed to generate tickets.');
    } finally {
      setGenerating(false);
    }
  };

  // Aggregate totals
  const totalSold     = events.reduce((s, e) => s + e.soldTickets, 0);
  const totalEntered  = events.reduce((s, e) => s + e.peopleEntered, 0);
  const totalCapacity = events.reduce((s, e) => s + e.totalTickets, 0);
  const entryPct      = totalSold > 0 ? Math.round((totalEntered / totalSold) * 100) : 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c89c6b] flex items-center justify-center flex-shrink-0">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#112b38]">Tickets Management</h1>
            {lastUpdated && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                Last updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                {refreshing && <span className="ml-2 text-[#c89c6b]">Refreshing…</span>}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {genMsg && <span className="text-xs text-green-600 font-medium">{genMsg}</span>}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#c89c6b] text-gray-700 text-sm font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleGenerateAll}
            disabled={generating}
            className="flex items-center gap-2 bg-[#112b38] hover:bg-[#1a3f50] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Generate All Tickets
          </button>
        </div>
      </div>

      {/* ── Global Traffic Counter ─────────────────────────────── */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Ticket className="w-4 h-4 text-gray-500" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Capacity</span>
            </div>
            <p className="text-3xl font-extrabold text-[#112b38]">{totalCapacity.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">across all events</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#c89c6b]/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#c89c6b]" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tickets Sold</span>
            </div>
            <p className="text-3xl font-extrabold text-[#c89c6b]">{totalSold.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0}% of capacity
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">People Entered</span>
            </div>
            <p className="text-3xl font-extrabold text-green-600">{totalEntered.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">scanned at entry</p>
          </div>

          <div className="bg-[#112b38] rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-[#c89c6b]" />
              </div>
              <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">Entry Rate</span>
            </div>
            <p className="text-3xl font-extrabold text-[#c89c6b]">{entryPct}%</p>
            <p className="text-xs text-white/40 mt-1">of sold tickets entered</p>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
              <div className="h-full bg-[#c89c6b] transition-all duration-700" style={{ width: `${entryPct}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Per Event Table ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4 text-left font-semibold">Event</th>
                  <th className="px-6 py-4 text-center font-semibold">Capacity</th>
                  <th className="px-6 py-4 text-center font-semibold">Sold</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-[220px]">Entry Traffic</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(ev => {
                  const pct = ev.soldTickets > 0
                    ? Math.min(100, Math.round((ev.peopleEntered / ev.soldTickets) * 100))
                    : 0;
                  const isLive = ev.peopleEntered > 0;
                  return (
                    <tr key={ev.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {(ev.bannerSquare || ev.coverImage) ? (
                              <img src={getImageUrl(ev.bannerSquare || ev.coverImage, '')} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Ticket className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#112b38] text-sm">{ev.title?.en || ev.title?.fr || '—'}</p>
                            {ev.startDate && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(ev.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">{ev.totalTickets.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-semibold ${ev.soldTickets > 0 ? 'text-[#c89c6b]' : 'text-gray-300'}`}>
                          {ev.soldTickets}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden min-w-[80px]">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-[#c89c6b]' : 'bg-gray-300'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-sm font-extrabold leading-tight ${isLive ? 'text-green-600' : 'text-gray-400'}`}>
                              {ev.peopleEntered}
                            </p>
                            <p className="text-[10px] text-gray-400">{pct}% in</p>
                          </div>
                          {isLive && (
                            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              LIVE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => router.push(`/admin/tickets/${ev.id}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-[#c89c6b] text-[#c89c6b] hover:bg-[#c89c6b] hover:text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


