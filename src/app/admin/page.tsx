'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import {
  Calendar, Users, Globe, EyeOff, Loader2, TrendingUp,
  Ticket, ArrowUpRight, Clock, Plus, FileImage, Settings, QrCode, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface FullStats {
  totalEvents: number;
  publicEvents: number;
  privateEvents: number;
  totalUsers: number;
  activeUsers: number;
  totalTicketTypes: number;
  categoryCounts: Record<string, number>;
  recentEvents: Array<{ id: string; _id?: string; title: { en: string }; startDate: string; isPublic: boolean; category: string; coverImage?: string }>;
  recentUsers: Array<{ id: string; _id?: string; name: string; email: string; createdAt: string; isActive: boolean }>;
}

const BAR_COLORS = ['#c89c6b', '#2a6b8a', '#e8b87a', '#1a4a60', '#d4a06a', '#3a7a9a'];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Main Admin', organizer: 'Organizer',
  moderator: 'Moderator', scanner: 'Scanner',
  ticket_runner: 'Ticket Runner',
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'user';
  const [stats, setStats] = useState<FullStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const isAdmin = role === 'admin';
        const [eventsRes, usersRes] = await Promise.all([
          api.get('/events/admin/all?limit=1000'),
          isAdmin ? api.get('/admin/users') : Promise.resolve({ data: { users: [] } }),
        ]);
        const events: any[] = eventsRes.data.events || [];
        const users: any[] = usersRes.data.users || [];

        const categoryCounts: Record<string, number> = {};
        events.forEach((e) => {
          const cat = e.category || 'other';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const totalTicketTypes = events.reduce((sum: number, e: any) => sum + (e.ticketTypes?.length || 0), 0);

        setStats({
          totalEvents: events.length,
          publicEvents: events.filter((e) => e.isPublic).length,
          privateEvents: events.filter((e) => !e.isPublic).length,
          totalUsers: users.length,
          activeUsers: users.filter((u) => u.isActive).length,
          totalTicketTypes,
          categoryCounts,
          recentEvents: events
            .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
            .slice(0, 5),
          recentUsers: users
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
        });
      } catch {
        setStats({
          totalEvents: 0, publicEvents: 0, privateEvents: 0,
          totalUsers: 0, activeUsers: 0, totalTicketTypes: 0,
          categoryCounts: {}, recentEvents: [], recentUsers: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      label: role === 'organizer' ? 'My Events' : 'Total Events',
      value: stats.totalEvents,
      icon: Calendar, bg: 'bg-[#112b38]', text: 'text-[#c89c6b]',
      sub: `${stats.publicEvents} public`, href: '/admin/events',
    },
    {
      label: 'Public Events', value: stats.publicEvents,
      icon: Globe, bg: 'bg-emerald-50', text: 'text-emerald-700',
      sub: `${Math.round((stats.publicEvents / Math.max(stats.totalEvents, 1)) * 100)}% of total`,
      href: '/admin/events',
    },
    ...(role === 'admin' ? [
      {
        label: 'Total Users', value: stats.totalUsers,
        icon: Users, bg: 'bg-[#c89c6b]/10', text: 'text-[#c89c6b]',
        sub: `${stats.activeUsers} active`, href: '/admin/users',
      },
    ] : []),
    {
      label: 'Ticket Types', value: stats.totalTicketTypes,
      icon: Ticket, bg: 'bg-blue-50', text: 'text-blue-700',
      sub: 'across all events', href: '/admin/events',
    },
  ] : [];

  const maxCat = stats ? Math.max(...Object.values(stats.categoryCounts), 1) : 1;

  // Scanner role — minimal dashboard
  if (role === 'scanner') {
    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Welcome, {user?.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Scanner Dashboard</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#112b38] mb-2">Ready to Scan</h2>
          <p className="text-gray-500 text-sm mb-6">Use your scanning device to verify tickets at the event entrance.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> System Online
          </div>
        </div>
        <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 w-fit">
          <Settings className="w-4 h-4 text-[#c89c6b]" /> Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#112b38]">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            <span className="capitalize font-medium text-[#c89c6b]">{ROLE_LABELS[role] || role}</span> — Here&apos;s your overview.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(role === 'admin' || role === 'organizer') && (
            <Link href="/admin/events/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#112b38] text-white rounded-lg text-sm font-medium hover:bg-[#0d2030] transition-colors border border-[#c89c6b]/20">
              <Plus className="w-4 h-4" /> Add Event
            </Link>
          )}
          {role === 'admin' && (
            <Link href="/admin/cms"
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <FileImage className="w-4 h-4 text-[#c89c6b]" /> CMS
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-16 justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#c89c6b]" /> Loading analytics...
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {statCards.map(({ label, value, icon: Icon, bg, text, sub, href }) => (
              <Link key={label} href={href}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#112b38]">{value}</p>
                <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3 text-[#c89c6b]" /> {sub}
                </p>
              </Link>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Events by Category — horizontal bar chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#112b38]">Events by Category</h2>
                <TrendingUp className="w-4 h-4 text-[#c89c6b]" />
              </div>
              <div className="space-y-3">
                {Object.entries(stats!.categoryCounts).length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No events yet</p>
                ) : (
                  Object.entries(stats!.categoryCounts).map(([cat, count], i) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="capitalize text-gray-600 font-medium">{cat}</span>
                        <span className="font-bold text-[#112b38]">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${(count / maxCat) * 100}%`,
                            backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Users overview — admin only */}
            {role === 'admin' ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#112b38]">Users Overview</h2>
                <Users className="w-4 h-4 text-[#c89c6b]" />
              </div>
              {/* Donut-like stats */}
              <div className="flex items-center justify-center gap-6 mb-5">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-8 border-[#112b38] flex items-center justify-center mx-auto">
                    <span className="text-lg font-bold text-[#112b38]">{stats!.totalUsers}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Active: <strong>{stats!.activeUsers}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Inactive: <strong>{stats!.totalUsers - stats!.activeUsers}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#c89c6b] flex-shrink-0" />
                    <span className="text-sm text-gray-600">Ticket Types: <strong>{stats!.totalTicketTypes}</strong></span>
                  </div>
                </div>
              </div>
              {/* Event visibility */}
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <Globe className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-emerald-700">{stats!.publicEvents}</p>
                  <p className="text-xs text-gray-500">Public Events</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <EyeOff className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-orange-600">{stats!.privateEvents}</p>
                  <p className="text-xs text-gray-500">Private Events</p>
                </div>
              </div>
            </div>
            ) : (
            /* Non-admin: show event visibility summary instead */
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#112b38]">Event Visibility</h2>
                <Globe className="w-4 h-4 text-[#c89c6b]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <Globe className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-700">{stats!.publicEvents}</p>
                  <p className="text-xs text-gray-500 mt-1">Public Events</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <EyeOff className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{stats!.privateEvents}</p>
                  <p className="text-xs text-gray-500 mt-1">Private Events</p>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Recent Events + Recent Users */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Recent Events */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-[#112b38]">Recent Events</h2>
                <Link href="/admin/events" className="text-xs text-[#c89c6b] hover:underline font-medium">View all →</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {stats!.recentEvents.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No events yet</p>
                ) : (
                  stats!.recentEvents.map((ev) => (
                    <div key={ev.id || ev._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#112b38]/10 flex-shrink-0 overflow-hidden">
                        {ev.coverImage ? (
                          <img
                            src={getImageUrl(ev.coverImage)}
                            alt="" className="w-full h-full object-cover"
                          />
                        ) : (
                          <Calendar className="w-5 h-5 text-[#c89c6b] m-2.5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#112b38] truncate">{ev.title?.en || '—'}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(ev.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${ev.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-600'}`}>
                          {ev.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c89c6b]/10 text-[#c89c6b] capitalize">
                          {ev.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Users — admin only */}
            {role === 'admin' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-[#112b38]">Recent Users</h2>
                <Link href="/admin/users" className="text-xs text-[#c89c6b] hover:underline font-medium">View all →</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {stats!.recentUsers.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
                ) : (
                  stats!.recentUsers.map((u) => (
                    <div key={u.id || u._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#112b38] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-[#c89c6b]">{u.name?.charAt(0)?.toUpperCase() || '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#112b38] truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-500'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold text-[#112b38] mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              {(role === 'admin' || role === 'organizer') && (
                <Link href="/admin/events/new"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#112b38] text-white rounded-lg text-sm font-medium hover:bg-[#0d2030] transition-colors">
                  <Calendar className="w-4 h-4 text-[#c89c6b]" /> Add New Event
                </Link>
              )}
              {role === 'admin' && (
                <Link href="/admin/cms"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <FileImage className="w-4 h-4 text-[#c89c6b]" /> Edit CMS Content
                </Link>
              )}
              {role === 'admin' && (
                <Link href="/admin/users"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Users className="w-4 h-4 text-[#c89c6b]" /> Manage Staff
                </Link>
              )}
              <Link href="/admin/events"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4 text-[#c89c6b]" /> View Events
              </Link>
              <Link href="/admin/settings"
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-[#c89c6b]" /> Settings
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

