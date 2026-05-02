'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X, ChevronRight, Copy, Check } from 'lucide-react';

type Role = 'admin' | 'organizer' | 'moderator' | 'scanner' | 'ticket_runner' | 'user';

// ── Nav definition ────────────────────────────────────────────────────────
// roles: which roles can see this item (undefined = admin only)
// special: gold color (Email-Whatsapp)
// arrow: show chevron right
// loginLink: show copy-link behaviour instead of navigate
interface NavItem {
  href: string;
  label: string;
  roles?: Role[];
  permission?: string; // if set, non-admin staff must have this permission
  special?: boolean;
  arrow?: boolean;
  loginRole?: string; // if set, clicking copies /staff-login/{loginRole}
}

interface NavGroup {
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: '/admin',     label: 'Dashboard',     roles: ['admin','organizer','moderator','scanner','ticket_runner'], permission: 'dashboard' },
      { href: '/admin/cms', label: 'CRM / Content', roles: ['admin'], arrow: true },
    ],
  },
  {
    items: [
      { href: '/admin/events',    label: 'Create Events', roles: ['admin','organizer'],               permission: 'events.create' },
      { href: '/admin/orders',    label: 'Orders',        roles: ['admin','organizer'],               permission: 'events.view' },
      { href: '/admin/tickets',   label: 'Tickets',       roles: ['admin','organizer','ticket_runner'], permission: 'tickets' },
      { href: '/admin/sponsors',  label: 'Sponsors',      roles: ['admin'] },
    ],
  },
  {
    items: [
      { href: '/admin/seats',         label: 'Seats Maps',        roles: ['admin'] },
      { href: '/admin/growth',        label: 'Each Growth Event', roles: ['admin'] },
      { href: '/admin/users',         label: 'Users',             roles: ['admin','moderator'], permission: 'users' },
      { href: '/admin/insights',      label: 'Insights',          roles: ['admin'] },
      { href: '/admin/notifications', label: 'Notification',      roles: ['admin'] },
    ],
  },
  {
    items: [
      { href: '/admin/archived', label: 'Archived Events', roles: ['admin'] },
      { href: '/admin/settings', label: 'Settings',        roles: ['admin','organizer','moderator','scanner','ticket_runner'], permission: 'settings' },
    ],
  },
  {
    items: [
      { href: '/admin/scanner',   label: 'SCAN',              roles: ['admin','scanner'], permission: 'scanner' },
      { href: '/admin/marketing', label: 'Email - Whatsapp',  roles: ['admin'], special: true },
    ],
  },
  {
    items: [
      { href: '/admin/users/admin',    label: 'Owner',          roles: ['admin'], loginRole: 'admin' },
      { href: '/admin/users/admin',    label: 'Admin',          roles: ['admin'], loginRole: 'admin' },
      { href: '/admin/users/moderator',label: 'Moderator',      roles: ['admin'], loginRole: 'moderator' },
      { href: '/admin/users/organizer',label: 'Organizer',      roles: ['admin'], loginRole: 'organizer' },
      { href: '/admin/users/scanner',  label: 'Scan Moderator', roles: ['admin'], loginRole: 'scanner' },
    ],
  },
  {
    items: [
      { href: '/admin/sales',    label: 'Sales Report',          roles: ['admin'] },
      { href: '/admin/revenue',  label: 'Revenue / Finance',     roles: ['admin'] },
      { href: '/admin/visitors', label: 'Visitors/Buyers Total', roles: ['admin'] },
      { href: '/admin/analytics',label: 'Analytics',             roles: ['admin'] },
    ],
  },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const navCallbackRef = useCallback((node: HTMLElement | null) => {
    navRef.current = node;
    if (node) {
      const saved = sessionStorage.getItem('sidebar-scroll');
      if (saved) node.scrollTop = Number(saved);
    }
  }, []);

  const saveScroll = () => {
    if (navRef.current) {
      sessionStorage.setItem('sidebar-scroll', String(navRef.current.scrollTop));
    }
  };

  const role = (user?.role || 'user') as Role;

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const handleLoginLink = (loginRole: string) => {
    const link = `${window.location.origin}/staff-login/${loginRole}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedRole(loginRole);
      setTimeout(() => setCopiedRole(null), 2000);
    });
  };

  // Parse user permissions (may come as JSON string or array)
  const userPerms: string[] = (() => {
    const p = (user as any)?.permissions;
    if (!p) return [];
    if (Array.isArray(p)) return p;
    if (typeof p === 'string') { try { return JSON.parse(p); } catch { return []; } }
    return [];
  })();

  const visibleGroups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => {
      // Must match role
      if (item.roles && !item.roles.includes(role)) return false;
      // Admin bypasses permission check
      if (role === 'admin') return true;
      // Staff: if item requires a permission, user must have it
      if (item.permission && !userPerms.includes(item.permission)) return false;
      return true;
    }),
  })).filter((g) => g.items.length > 0);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#112b38]">
      {/* Logo */}
      <div className="bg-white w-full flex items-center justify-start">
        <Image
          src="/images/Logo/ALL PNG-01.png"
          alt="Oshaia"
          width={200}
          height={80}
          className="object-contain w-full h-auto max-h-20"
        />
      </div>

      {/* Role badge */}
      <div className="pl-0 pr-4 pt-3 pb-3">
        <div className="bg-white text-black rounded-r-full pl-4 pr-5 py-2">
          <span className="text-black font-bold text-sm tracking-wide">{user?.name}</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav ref={navCallbackRef} onScroll={saveScroll} className="flex-1 px-4 overflow-y-auto pb-4">
        {visibleGroups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <div className="my-2.5 border-t border-white/10" />}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const isCopied = copiedRole === item.loginRole;

                if (item.loginRole) {
                  // Render as navigate link + copy button
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 group transition-colors"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-sm font-medium text-white/75 hover:text-white"
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => handleLoginLink(item.loginRole!)}
                        title="Copy login link"
                        className="ml-2 flex-shrink-0"
                      >
                        {isCopied
                          ? <Check className="w-3.5 h-3.5 text-green-400" />
                          : <Copy className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60" />}
                      </button>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors rounded-lg
                      ${item.special
                        ? 'text-[#c89c6b] hover:bg-white/5'
                        : active
                          ? 'text-[#c89c6b] bg-white/5'
                          : 'text-white/75 hover:text-white hover:bg-white/5'}`}
                  >
                    <span>{item.label}</span>
                    {item.arrow && <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </nav>

      {/* Log Out */}
      <div className="p-4 pt-3">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#c89c6b] text-white font-bold text-sm hover:bg-[#b8885a] transition-colors shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-52 flex-shrink-0" style={{ minHeight: '100vh' }}>
        <div className="sticky top-0 h-screen overflow-y-auto flex flex-col">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile: top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#112b38] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1">
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="font-bold text-white text-sm tracking-wider">oshaia</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/70 font-medium">{user?.name}</span>
          <div className="w-8 h-8 rounded-full bg-[#c89c6b] flex items-center justify-center overflow-hidden">
            {user?.avatar
              ? <Image src={user.avatar} alt={user.name || ''} width={32} height={32} className="w-full h-full object-cover" />
              : <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-52 flex flex-col shadow-2xl relative">
            <SidebarContent />
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}

