'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Loader2, UserX, UserCheck, Plus, X, Eye, EyeOff,
  Link2, Copy, Check, ArrowLeft, Users, ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────────────
type StaffRole = 'admin' | 'organizer' | 'moderator' | 'scanner' | 'ticket_runner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  phone?: string;
  permissions?: any;
}

// ── Role meta ──────────────────────────────────────────────────────────────
const ROLE_META: Record<string, { label: string; desc: string; color: string; bg: string }> = {
  admin:         { label: 'Owner / Admin',   desc: 'Full platform access, manage everything', color: 'text-purple-700', bg: 'bg-purple-100' },
  organizer:     { label: 'Organizer',       desc: 'Create and manage their own events',       color: 'text-blue-700',   bg: 'bg-blue-100'   },
  moderator:     { label: 'Moderator',       desc: 'Review events and toggle visibility',      color: 'text-orange-700', bg: 'bg-orange-100' },
  scanner:       { label: 'Scan Moderator',  desc: 'Scan tickets at events',                   color: 'text-green-700',  bg: 'bg-green-100'  },
  ticket_runner: { label: 'Ticket Runner',   desc: 'Manage ticket distribution on ground',     color: 'text-yellow-800', bg: 'bg-yellow-100' },
};

// ── Permissions ────────────────────────────────────────────────────────────
const PERMISSION_GROUPS = [
  {
    group: 'General',
    items: [
      { key: 'dashboard', label: 'Dashboard', desc: 'Access dashboard overview' },
      { key: 'settings',  label: 'Settings',  desc: 'View and edit account settings' },
    ],
  },
  {
    group: 'Events',
    items: [
      { key: 'events.view',   label: 'View Events',       desc: 'Browse all events list' },
      { key: 'events.create', label: 'Create Events',     desc: 'Add new events' },
      { key: 'events.edit',   label: 'Edit Events',       desc: 'Modify existing events' },
      { key: 'events.delete', label: 'Delete Events',     desc: 'Permanently remove events' },
      { key: 'events.toggle', label: 'Toggle Visibility', desc: 'Publish or unpublish events' },
    ],
  },
  {
    group: 'Other',
    items: [
      { key: 'cms',     label: 'CMS / Content',    desc: 'Edit homepage content' },
      { key: 'users',   label: 'Staff Management', desc: 'Create and manage staff accounts' },
      { key: 'scanner', label: 'Ticket Scanner',   desc: 'Scan event tickets' },
      { key: 'tickets', label: 'Ticket Management', desc: 'Manage ticket distribution' },
    ],
  },
];

const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  admin:         ['dashboard', 'events.view', 'events.create', 'events.edit', 'events.delete', 'events.toggle', 'cms', 'users', 'scanner', 'tickets', 'settings'],
  organizer:     ['dashboard', 'events.view', 'events.create', 'events.edit', 'settings'],
  moderator:     ['dashboard', 'events.view', 'events.toggle', 'settings'],
  scanner:       ['dashboard', 'scanner', 'settings'],
  ticket_runner: ['dashboard', 'tickets', 'settings'],
};

const toPermArray = (perms: any): string[] => {
  if (!perms) return [];
  if (Array.isArray(perms)) return perms;
  if (typeof perms === 'string') { try { return JSON.parse(perms); } catch { return []; } }
  return [];
};

// ── Page ───────────────────────────────────────────────────────────────────
export default function RoleDetailPage() {
  const { role } = useParams<{ role: string }>();
  const router = useRouter();

  const meta = ROLE_META[role] ?? { label: role, desc: '', color: 'text-gray-700', bg: 'bg-gray-100' };

  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // Create form
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating]   = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [permissions, setPermissions] = useState<string[]>(ROLE_DEFAULT_PERMISSIONS[role] ?? []);

  // Invite link
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Detail expand
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers((data.users || []).filter((u: User) => u.role === role)))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [role]);

  const getInviteLink = () =>
    typeof window !== 'undefined' ? `${window.location.origin}/staff-login/${role}` : '';

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
      toast.success('Login link copied!');
    } catch { toast.error('Failed to copy'); }
  };

  const toggleActive = async (user: User) => {
    setActionId(user.id);
    try {
      await api.patch(`/admin/users/${user.id}`, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
      toast.success(user.isActive ? 'Deactivated' : 'Activated');
    } catch { toast.error('Action failed'); }
    finally { setActionId(null); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/admin/users', { ...form, role, permissions });
      setUsers(prev => [data.user, ...prev]);
      toast.success(`${meta.label} account created`);
      setShowModal(false);
      setInviteLink(getInviteLink());
      setCopied(false);
      setForm({ name: '', email: '', password: '' });
      setPermissions(ROLE_DEFAULT_PERMISSIONS[role] ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create');
    } finally { setCreating(false); }
  };

  const togglePermission = (key: string) =>
    setPermissions(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);

  const inp = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] bg-white';

  const active   = users.filter(u => u.isActive).length;
  const inactive = users.length - active;

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/users')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
            <Users className={`w-5 h-5 ${meta.color}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#112b38]">{meta.label}</h1>
            <p className="text-sm text-gray-500">{meta.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => copyLink(getInviteLink())}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
            Copy Login Link
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#112b38] text-white rounded-xl text-sm font-semibold hover:bg-[#0d2030] transition-colors border border-[#c89c6b]/30"
          >
            <Plus className="w-4 h-4" /> Add {meta.label}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',    value: users.length, color: 'text-[#112b38]' },
          { label: 'Active',   value: active,       color: 'text-green-600' },
          { label: 'Inactive', value: inactive,     color: 'text-red-500'   },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Login link info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">Staff Login URL</p>
          <p className="text-sm font-mono text-[#112b38] truncate">{getInviteLink()}</p>
        </div>
        <button
          onClick={() => copyLink(getInviteLink())}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${copied ? 'bg-green-100 text-green-700' : 'bg-[#112b38] text-white hover:bg-[#0d2030]'}`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No {meta.label} accounts yet</p>
          <button onClick={() => setShowModal(true)} className="mt-4 px-4 py-2 bg-[#c89c6b] text-white rounded-lg text-sm font-semibold">
            Create First Account
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Joined</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${meta.bg} ${meta.color}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleActive(user)}
                            disabled={actionId === user.id || role === 'admin'}
                            title={role === 'admin' ? 'Cannot deactivate admin' : user.isActive ? 'Deactivate' : 'Activate'}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-30"
                          >
                            {actionId === user.id
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyLink(getInviteLink())}
                            title="Copy login link"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#c89c6b] hover:bg-[#c89c6b]/10 transition-colors"
                          >
                            <Link2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
                            title="View permissions"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-[#112b38] hover:bg-gray-100 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded permission row */}
                    {expandedId === user.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-5 py-4">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Permissions</p>
                          <div className="flex flex-wrap gap-1.5">
                            {toPermArray(user.permissions).length > 0
                              ? toPermArray(user.permissions).map(p => (
                                  <span key={p} className="px-2 py-0.5 bg-[#c89c6b]/10 text-[#112b38] rounded text-xs font-medium">{p}</span>
                                ))
                              : <span className="text-xs text-gray-400 italic">Using role defaults</span>
                            }
                          </div>
                          {user.phone && <p className="text-xs text-gray-500 mt-2">Phone: {user.phone}</p>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Invite Link Modal ──────────────────────────────────────────────── */}
      {inviteLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Link2 className="w-5 h-5 text-green-600" /></div>
              <div>
                <h2 className="text-base font-bold text-[#112b38]">Account Created!</h2>
                <p className="text-xs text-gray-500">Share this login link with your staff member</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
              <p className="flex-1 text-sm text-[#112b38] font-mono break-all select-all">{inviteLink}</p>
              <button onClick={() => copyLink(inviteLink)} className={`flex-shrink-0 p-2 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-[#112b38] text-white hover:bg-[#0d2030]'}`}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={() => setInviteLink(null)} className="w-full py-2.5 bg-[#112b38] text-white rounded-xl text-sm font-semibold hover:bg-[#0d2030] transition-colors border border-[#c89c6b]/30">Done</button>
          </div>
        </div>
      )}

      {/* ── Create Modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-[#112b38]">Create {meta.label} Account</h2>
                <p className="text-xs text-gray-500 mt-0.5">{meta.desc}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                <div className="relative">
                  <input required type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Strong password" className={inp + ' pr-10'} />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="text-xs text-gray-500 mb-2 block font-semibold">Permissions</label>
                {PERMISSION_GROUPS.map(group => (
                  <div key={group.group} className="mb-3">
                    <p className="text-xs text-gray-400 font-medium mb-1.5">{group.group}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {group.items.map(item => (
                        <label key={item.key} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${permissions.includes(item.key) ? 'bg-[#112b38] border-[#112b38] text-white' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="checkbox" className="sr-only" checked={permissions.includes(item.key)} onChange={() => togglePermission(item.key)} />
                          <div className="mt-0.5 w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center" style={{ borderColor: permissions.includes(item.key) ? '#c89c6b' : 'currentColor', backgroundColor: permissions.includes(item.key) ? '#c89c6b' : 'transparent' }}>
                            {permissions.includes(item.key) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div>
                            <p className={`text-xs font-medium leading-tight ${permissions.includes(item.key) ? 'text-white' : 'text-gray-700'}`}>{item.label}</p>
                            <p className={`text-[10px] leading-tight mt-0.5 ${permissions.includes(item.key) ? 'text-white/60' : 'text-gray-400'}`}>{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={creating} className="w-full py-3 bg-[#c89c6b] text-white font-bold rounded-xl hover:bg-[#b8885a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {creating && <Loader2 className="w-4 h-4 animate-spin" />} Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
