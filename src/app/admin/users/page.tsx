'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, UserX, UserCheck, Search, Plus, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

type StaffRole = 'organizer' | 'moderator' | 'scanner' | 'ticket_runner';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  phone?: string;
  permissions?: string[] | null;
}

const ROLE_STYLES: Record<string, string> = {
  admin:         'bg-purple-100 text-purple-700',
  organizer:     'bg-blue-100 text-blue-700',
  moderator:     'bg-orange-100 text-orange-700',
  scanner:       'bg-green-100 text-green-700',
  ticket_runner: 'bg-yellow-100 text-yellow-800',
  user:          'bg-gray-100 text-gray-600',
};

const ROLE_LABELS: Record<string, string> = {
  admin: 'Main Admin', organizer: 'Organizer',
  moderator: 'Moderator', scanner: 'Scanner',
  ticket_runner: 'Ticket Runner', user: 'User',
};

const STAFF_ROLES: { value: StaffRole; label: string; desc: string }[] = [
  { value: 'organizer',     label: 'Organizer',     desc: 'Create & manage their own events' },
  { value: 'moderator',     label: 'Moderator',     desc: 'Review events & toggle visibility' },
  { value: 'scanner',       label: 'Scanner',       desc: 'Scan tickets at events' },
  { value: 'ticket_runner', label: 'Ticket Runner', desc: 'Manage ticket distribution' },
];

// All permissions with labels grouped by category
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
      { key: 'events.view',   label: 'View Events',        desc: 'Browse all events list' },
      { key: 'events.create', label: 'Create Events',      desc: 'Add new events' },
      { key: 'events.edit',   label: 'Edit Events',        desc: 'Modify existing events' },
      { key: 'events.delete', label: 'Delete Events',      desc: 'Permanently remove events' },
      { key: 'events.toggle', label: 'Toggle Visibility',  desc: 'Publish or unpublish events' },
    ],
  },
  {
    group: 'Other',
    items: [
      { key: 'cms',     label: 'CMS / Content',   desc: 'Edit homepage content' },
      { key: 'users',   label: 'Staff Management', desc: 'Create and manage staff accounts' },
      { key: 'scanner', label: 'Ticket Scanner',   desc: 'Scan event tickets' },
      { key: 'tickets', label: 'Ticket Management', desc: 'Manage ticket distribution' },
    ],
  },
];

const ROLE_DEFAULT_PERMISSIONS: Record<StaffRole, string[]> = {
  organizer:     ['dashboard', 'events.view', 'events.create', 'events.edit', 'settings'],
  moderator:     ['dashboard', 'events.view', 'events.toggle', 'settings'],
  scanner:       ['dashboard', 'scanner', 'settings'],
  ticket_runner: ['dashboard', 'tickets', 'settings'],
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('all');

  // Create staff modal
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'organizer' as StaffRole });
  const [showPass, setShowPass] = useState(false);
  const [permissions, setPermissions] = useState<string[]>(ROLE_DEFAULT_PERMISSIONS['organizer']);

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  // Auto-update permissions when role changes
  const handleRoleChange = (role: StaffRole) => {
    setForm((f) => ({ ...f, role }));
    setPermissions(ROLE_DEFAULT_PERMISSIONS[role]);
  };

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const toggleActive = async (user: User) => {
    setActionId(user.id);
    try {
      await api.patch(`/admin/users/${user.id}`, { isActive: !user.isActive });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isActive: !u.isActive } : u));
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
    } catch {
      toast.error('Action failed');
    } finally {
      setActionId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await api.post('/admin/users', { ...form, permissions });
      setUsers((prev) => [data.user, ...prev]);
      toast.success(`${ROLE_LABELS[form.role]} account created`);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'organizer' });
      setPermissions(ROLE_DEFAULT_PERMISSIONS['organizer']);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create account');
    } finally {
      setCreating(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} accounts total</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#112b38] text-white rounded-xl text-sm font-semibold hover:bg-[#0d2030] transition-colors border border-[#c89c6b]/30">
          <Plus className="w-4 h-4" /> Create Staff Account
        </button>
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAFF_ROLES.map(({ value, label }) => (
          <div key={value} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-[#112b38] mt-1">{users.filter((u) => u.role === value).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] w-64" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] bg-white">
          <option value="all">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Permissions</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-gray-400">No users found.</td></tr>
                )}
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[user.role] || 'bg-gray-100 text-gray-600'}`}>
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.permissions && user.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.permissions.slice(0, 3).map((p) => (
                            <span key={p} className="px-1.5 py-0.5 bg-[#c89c6b]/10 text-[#112b38] rounded text-[10px] font-medium">{p}</span>
                          ))}
                          {user.permissions.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">+{user.permissions.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Role defaults</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(user)}
                        disabled={actionId === user.id || user.role === 'admin'}
                        title={user.role === 'admin' ? 'Cannot deactivate admin' : ''}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        {actionId === user.id ? <Loader2 className="w-4 h-4 animate-spin" />
                          : user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-[#112b38]">Create Staff Account</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Role picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {STAFF_ROLES.map(({ value, label, desc }) => (
                    <button key={value} type="button" onClick={() => handleRoleChange(value)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${form.role === value ? 'border-[#c89c6b] bg-[#c89c6b]/10' : 'border-gray-200 hover:border-gray-300'}`}>
                      <p className="text-xs font-bold text-[#112b38]">{label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#c89c6b]" />
                  <label className="text-sm font-medium text-gray-700">Permissions</label>
                  <span className="ml-auto text-[10px] text-gray-400">{permissions.length} selected</span>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {PERMISSION_GROUPS.map(({ group, items }) => (
                    <div key={group}>
                      <div className="px-3 py-2 bg-gray-50">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{group}</p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {items.map(({ key, label, desc }) => (
                          <label key={key}
                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={permissions.includes(key)}
                              onChange={() => togglePermission(key)}
                              className="w-4 h-4 accent-[#c89c6b] rounded flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#112b38]">{label}</p>
                              <p className="text-[10px] text-gray-400">{desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="staff@oshaia.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required minLength={8}
                    value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Share this with the staff member. They can change it from Settings.</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 bg-[#112b38] text-white rounded-xl text-sm font-semibold hover:bg-[#0d2030] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 border border-[#c89c6b]/30">
                  {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
