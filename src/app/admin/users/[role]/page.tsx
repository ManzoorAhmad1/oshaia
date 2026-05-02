'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Loader2, UserX, UserCheck, Plus, X, Eye, EyeOff,
  Link2, Copy, Check, ArrowLeft, Users, ShieldCheck,
  Pencil, KeyRound, Phone, Calendar, Mail,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────────────────────
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

  const [users, setUsers]       = useState<User[]>([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  // ── Create modal ────────────────────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating]     = useState(false);
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' });
  const [createPerms, setCreatePerms] = useState<string[]>(ROLE_DEFAULT_PERMISSIONS[role] ?? []);

  // ── View modal ──────────────────────────────────────────────────────────
  const [viewUser, setViewUser] = useState<User | null>(null);

  // ── Edit modal ──────────────────────────────────────────────────────────
  const [editUser, setEditUser]   = useState<User | null>(null);
  const [saving, setSaving]       = useState(false);
  const [editForm, setEditForm]   = useState({ name: '', email: '', newPassword: '' });
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [showEditPass, setShowEditPass] = useState(false);

  // ── Invite link ─────────────────────────────────────────────────────────
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied]         = useState(false);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers((data.users || []).filter((u: User) => u.role === role)))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [role]);

  const openEdit = (u: User) => {
    setEditUser(u);
    setEditForm({ name: u.name, email: u.email, newPassword: '' });
    setEditPerms(toPermArray(u.permissions).length > 0 ? toPermArray(u.permissions) : (ROLE_DEFAULT_PERMISSIONS[u.role] ?? []));
    setShowEditPass(false);
  };

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
      const { data } = await api.post('/admin/users', { ...createForm, role, permissions: createPerms });
      setUsers(prev => [data.user, ...prev]);
      toast.success(`${meta.label} account created`);
      setShowCreate(false);
      setInviteLink(getInviteLink());
      setCopied(false);
      setCreateForm({ name: '', email: '', password: '' });
      setCreatePerms(ROLE_DEFAULT_PERMISSIONS[role] ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create');
    } finally { setCreating(false); }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setSaving(true);
    try {
      // Update name / email / permissions
      const { data } = await api.patch(`/admin/users/${editUser.id}`, {
        name: editForm.name,
        email: editForm.email,
        permissions: editPerms,
      });
      // Reset password if filled
      if (editForm.newPassword.trim()) {
        if (editForm.newPassword.length < 8) {
          toast.error('Password must be at least 8 characters');
          setSaving(false);
          return;
        }
        await api.patch(`/admin/users/${editUser.id}/reset-password`, { password: editForm.newPassword });
      }
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...data.user, permissions: editPerms } : u));
      toast.success('User updated successfully');
      setEditUser(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const toggleCreatePerm = (key: string) =>
    setCreatePerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);

  const toggleEditPerm = (key: string) =>
    setEditPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);

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
            onClick={() => setShowCreate(true)}
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
          <button onClick={() => setShowCreate(true)} className="mt-4 px-4 py-2 bg-[#c89c6b] text-white rounded-lg text-sm font-semibold">
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
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${meta.bg} ${meta.color}`}>
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

                        {/* 👁 View */}
                        <button
                          onClick={() => setViewUser(user)}
                          title="View details"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* ✏️ Edit */}
                        <button
                          onClick={() => openEdit(user)}
                          title="Edit user"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#c89c6b] hover:bg-[#c89c6b]/10 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* 🔌 Activate / Deactivate */}
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

                        {/* 🔗 Copy login link */}
                        <button
                          onClick={() => copyLink(getInviteLink())}
                          title="Copy login link"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#112b38] hover:bg-gray-100 transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
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

      {/* ── VIEW Modal ─────────────────────────────────────────────────────── */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#112b38]">User Details</h2>
              <button onClick={() => setViewUser(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Avatar row */}
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0 ${meta.bg} ${meta.color}`}>
                  {viewUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{viewUser.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${viewUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                    {viewUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                {[
                  { icon: <Mail className="w-4 h-4" />, label: 'Email', value: viewUser.email },
                  { icon: <ShieldCheck className="w-4 h-4" />, label: 'Role', value: meta.label },
                  { icon: <Calendar className="w-4 h-4" />, label: 'Joined', value: new Date(viewUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                  ...(viewUser.phone ? [{ icon: <Phone className="w-4 h-4" />, label: 'Phone', value: viewUser.phone }] : []),
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 flex-shrink-0">{row.icon}</span>
                    <span className="text-xs text-gray-500 w-14 flex-shrink-0">{row.label}</span>
                    <span className="text-sm text-gray-800 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Permissions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {toPermArray(viewUser.permissions).length > 0
                    ? toPermArray(viewUser.permissions).map(p => (
                        <span key={p} className="px-2 py-0.5 bg-[#c89c6b]/10 text-[#112b38] rounded text-xs font-medium">{p}</span>
                      ))
                    : <span className="text-xs text-gray-400 italic">Using role defaults</span>
                  }
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => { setViewUser(null); openEdit(viewUser); }}
                  className="flex-1 py-2.5 border border-[#c89c6b] text-[#c89c6b] rounded-xl text-sm font-semibold hover:bg-[#c89c6b]/5 flex items-center justify-center gap-2">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => setViewUser(null)}
                  className="flex-1 py-2.5 bg-[#112b38] text-white rounded-xl text-sm font-semibold hover:bg-[#0d2030] flex items-center justify-center gap-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT Modal ─────────────────────────────────────────────────────── */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-[#112b38]">Edit — {editUser.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Update info, permissions, or reset password</p>
              </div>
              <button onClick={() => setEditUser(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                  <input required value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Email</label>
                  <input required type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className={inp} />
                </div>
              </div>

              {/* Password reset (optional) */}
              <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="w-4 h-4 text-[#c89c6b]" />
                  <p className="text-xs font-semibold text-gray-600">Reset Password <span className="font-normal text-gray-400">(leave blank to keep current)</span></p>
                </div>
                <div className="relative">
                  <input
                    type={showEditPass ? 'text' : 'password'}
                    value={editForm.newPassword}
                    onChange={e => setEditForm(f => ({ ...f, newPassword: e.target.value }))}
                    placeholder="New password (min 8 chars)"
                    className={inp + ' pr-10'}
                  />
                  <button type="button" onClick={() => setShowEditPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showEditPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                        <label key={item.key} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${editPerms.includes(item.key) ? 'bg-[#112b38] border-[#112b38]' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="checkbox" className="sr-only" checked={editPerms.includes(item.key)} onChange={() => toggleEditPerm(item.key)} />
                          <div className="mt-0.5 w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center" style={{ borderColor: editPerms.includes(item.key) ? '#c89c6b' : '#9ca3af', backgroundColor: editPerms.includes(item.key) ? '#c89c6b' : 'transparent' }}>
                            {editPerms.includes(item.key) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div>
                            <p className={`text-xs font-medium leading-tight ${editPerms.includes(item.key) ? 'text-white' : 'text-gray-700'}`}>{item.label}</p>
                            <p className={`text-[10px] leading-tight mt-0.5 ${editPerms.includes(item.key) ? 'text-white/60' : 'text-gray-400'}`}>{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 bg-[#c89c6b] text-white font-bold rounded-xl hover:bg-[#b8885a] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
              </button>
            </form>
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
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-[#112b38]">Create {meta.label} Account</h2>
                <p className="text-xs text-gray-500 mt-0.5">{meta.desc}</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input required value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Full Name" className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input required type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                <div className="relative">
                  <input required type={showCreatePass ? 'text' : 'password'} value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" className={inp + ' pr-10'} />
                  <button type="button" onClick={() => setShowCreatePass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showCreatePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                        <label key={item.key} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${createPerms.includes(item.key) ? 'bg-[#112b38] border-[#112b38]' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="checkbox" className="sr-only" checked={createPerms.includes(item.key)} onChange={() => toggleCreatePerm(item.key)} />
                          <div className="mt-0.5 w-3.5 h-3.5 rounded border-2 flex-shrink-0 flex items-center justify-center" style={{ borderColor: createPerms.includes(item.key) ? '#c89c6b' : '#9ca3af', backgroundColor: createPerms.includes(item.key) ? '#c89c6b' : 'transparent' }}>
                            {createPerms.includes(item.key) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <div>
                            <p className={`text-xs font-medium leading-tight ${createPerms.includes(item.key) ? 'text-white' : 'text-gray-700'}`}>{item.label}</p>
                            <p className={`text-[10px] leading-tight mt-0.5 ${createPerms.includes(item.key) ? 'text-white/60' : 'text-gray-400'}`}>{item.desc}</p>
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
