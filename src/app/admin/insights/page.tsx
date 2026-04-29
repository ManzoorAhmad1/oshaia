'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, BarChart3, TrendingUp, Calendar, Ticket, Users, Globe, EyeOff } from 'lucide-react';

const BAR_COLORS = ['#c89c6b', '#2a6b8a', '#e8b87a', '#1a4a60', '#d4a06a', '#3a7a9a'];

export default function InsightsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/events/admin/all'), api.get('/admin/users')])
      .then(([eRes, uRes]) => { setEvents(eRes.data.events || []); setUsers(uRes.data.users || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming  = events.filter(e => new Date(e.startDate) > now);
  const past      = events.filter(e => new Date(e.startDate) <= now);
  const publicEv  = events.filter(e => e.isPublic);
  const privateEv = events.filter(e => !e.isPublic);

  const catMap: Record<string, number> = {};
  events.forEach(e => { catMap[e.category || 'other'] = (catMap[e.category || 'other'] || 0) + 1; });
  const maxCat = Math.max(...Object.values(catMap), 1);

  const totalSeats = events.reduce((s, e) =>
    s + (e.ticketTypes || []).reduce((ts: number, t: any) => ts + (Number(t.totalSeats) || 0), 0), 0);
  const soldSeats = events.reduce((s, e) =>
    s + (e.ticketTypes || []).reduce((ts: number, t: any) => ts + ((Number(t.totalSeats) || 0) - (Number(t.availableSeats) || 0)), 0), 0);
  const fillRate = totalSeats > 0 ? Math.round((soldSeats / totalSeats) * 100) : 0;

  const roleMap: Record<string, number> = {};
  users.forEach(u => { roleMap[u.role] = (roleMap[u.role] || 0) + 1; });

  // Top 5 events by sold tickets
  const topEvents = events
    .map(e => ({
      title: e.title?.en || e.title?.fr || `#${e.id}`,
      sold: (e.ticketTypes || []).reduce((s: number, t: any) => s + ((Number(t.totalSeats) || 0) - (Number(t.availableSeats) || 0)), 0),
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
  const maxSold = Math.max(...topEvents.map(e => e.sold), 1);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Insights</h1>
          <p className="text-sm text-gray-500">Platform-wide event and staff performance metrics</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Events', value: events.length, icon: <Calendar className="w-4 h-4" />, color: 'text-[#112b38]' },
              { label: 'Upcoming', value: upcoming.length, icon: <TrendingUp className="w-4 h-4" />, color: 'text-blue-600' },
              { label: 'Total Seats', value: totalSeats, icon: <Ticket className="w-4 h-4" />, color: 'text-[#c89c6b]' },
              { label: 'Fill Rate', value: `${fillRate}%`, icon: <BarChart3 className="w-4 h-4" />, color: 'text-green-600' },
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
            {/* Visibility split */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Public vs Private</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="flex items-center gap-1 text-gray-600"><Globe className="w-3.5 h-3.5 text-green-500" />Public</span>
                    <span className="font-bold text-[#112b38]">{publicEv.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full bg-green-500" style={{ width: `${events.length > 0 ? (publicEv.length / events.length) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="flex items-center gap-1 text-gray-600"><EyeOff className="w-3.5 h-3.5 text-gray-400" />Private</span>
                    <span className="font-bold text-[#112b38]">{privateEv.length}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="h-3 rounded-full bg-gray-400" style={{ width: `${events.length > 0 ? (privateEv.length / events.length) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Upcoming</p>
                  <p className="text-2xl font-extrabold text-blue-600">{upcoming.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Past Events</p>
                  <p className="text-2xl font-extrabold text-gray-400">{past.length}</p>
                </div>
              </div>
            </div>

            {/* Events by category */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Events by Category</h2>
              {Object.keys(catMap).length === 0 ? <p className="text-gray-400 text-sm text-center py-8">No events yet</p> : (
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
              {topEvents.every(e => e.sold === 0) ? <p className="text-gray-400 text-sm text-center py-8">No ticket sales yet</p> : (
                <div className="space-y-3">
                  {topEvents.map((e, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="text-gray-700 font-medium truncate max-w-[200px]">{e.title}</span>
                        <span className="font-bold text-[#112b38] ml-2">{e.sold}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full bg-[#c89c6b]" style={{ width: `${(e.sold / maxSold) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Staff breakdown */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="font-bold text-[#112b38] mb-4">Staff by Role</h2>
              {Object.keys(roleMap).length === 0 ? <p className="text-gray-400 text-sm text-center py-8">No staff yet</p> : (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(roleMap).map(([role, count]) => (
                    <div key={role} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 capitalize">{role.replace('_', ' ')}</p>
                      <p className="text-xl font-extrabold text-[#112b38]">{count}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
