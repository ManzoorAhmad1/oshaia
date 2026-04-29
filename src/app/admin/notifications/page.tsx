'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Bell, Plus, Trash2, CheckCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotifRow {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetRole: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_STYLES: Record<string, string> = {
  info:    'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-800',
  error:   'bg-red-100 text-red-600',
};

const ROLES = ['all', 'admin', 'organizer', 'moderator', 'scanner', 'ticket_runner'];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<NotifRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', targetRole: 'all' });

  const load = () => {
    api.get('/notifications')
      .then(res => setNotifs(res.data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/notifications', form);
      setNotifs(prev => [data.notification, ...prev]);
      toast.success('Notification created');
      setShowForm(false);
      setForm({ title: '', message: '', type: 'info', targetRole: 'all' });
    } catch { toast.error('Failed to create'); }
    finally { setSaving(false); }
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all').catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All marked as read');
  };

  const remove = async (id: number) => {
    await api.delete(`/notifications/${id}`).catch(() => {});
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  const inp = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]';

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#112b38]">Notifications</h1>
            <p className="text-sm text-gray-500">{notifs.filter(n => !n.isRead).length} unread</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#112b38] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2030]">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#112b38]">New Notification</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Title" className={inp} />
              <textarea required rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Message" className={inp + ' resize-none'} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className={inp}>
                    {['info', 'success', 'warning', 'error'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Target Role</label>
                  <select value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}
                    className={inp}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-2.5 bg-[#c89c6b] text-white font-semibold rounded-lg text-sm hover:bg-[#b8885a] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Send Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
        ) : notifs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id} className={`bg-white border rounded-2xl p-4 flex items-start gap-4 ${!n.isRead ? 'border-[#c89c6b]/40' : 'border-gray-200'}`}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.isRead ? 'bg-[#c89c6b]' : 'bg-gray-200'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{n.title}</h3>
                  <button onClick={() => remove(n.id)} className="text-gray-300 hover:text-red-400 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${TYPE_STYLES[n.type] || 'bg-gray-100 text-gray-500'}`}>{n.type}</span>
                  <span className="text-xs text-gray-400">→ {n.targetRole}</span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
