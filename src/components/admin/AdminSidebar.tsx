'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

type Role = 'admin' | 'organizer' | 'moderator' | 'scanner' | 'ticket_runner' | 'user';

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Main Admin',
  organizer: 'Organizer',
  moderator: 'Moderator',
  scanner: 'Scanner',
  ticket_runner: 'Ticket Runner',
  user: 'User',
};

// Title shown in the white pill badge at the top of the sidebar
const ROLE_PANEL_TITLES: Record<Role, string> = {
  admin: 'Admin Panel',
  organizer: 'Organizer Panel',
  moderator: 'Content Moderator',
  scanner: 'Scanner Moderator',
  ticket_runner: 'Ticket Runner',
  user: 'User Panel',
};

const ALL_NAV_ITEMS: { href: string; label: string; exact?: boolean; perms: string[] }[] = [
  { href: '/admin',          label: 'Dashboard',    exact: true, perms: ['dashboard'] },
  { href: '/admin/events',   label: 'Events',                    perms: ['events.view','events.create','events.edit','events.delete','events.toggle'] },
  { href: '/admin/cms',      label: 'CMS / Content',             perms: ['cms'] },
  { href: '/admin/users',    label: 'Staff',                     perms: ['users'] },
  { href: '/admin/scanner',  label: 'Scan Ticket',               perms: ['scanner'] },
  { href: '/admin/tickets',  label: 'Tickets',                   perms: ['tickets'] },
  { href: '/admin/settings', label: 'Settings',                  perms: ['settings'] },
];

const ROLE_DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  admin:         ['dashboard','events.view','events.create','events.edit','events.delete','events.toggle','cms','users','scanner','tickets','settings'],
  organizer:     ['dashboard','events.view','events.create','events.edit','settings'],
  moderator:     ['dashboard','events.view','events.toggle','settings'],
  scanner:       ['dashboard','scanner','settings'],
  ticket_runner: ['dashboard','tickets','settings'],
  user:          ['dashboard','settings'],
};

const getNavItems = (role: Role, userPermissions?: string[] | null) => {
  if (role === 'admin') return ALL_NAV_ITEMS;
  const perms = (userPermissions && userPermissions.length > 0)
    ? userPermissions
    : ROLE_DEFAULT_PERMISSIONS[role] || ['dashboard', 'settings'];
  return ALL_NAV_ITEMS.filter((item) => item.perms.some((p) => perms.includes(p)));
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (user?.role || 'user') as Role;
  const navItems = getNavItems(role, user?.permissions);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#112b38]">
      {/* Logo — full white background flush to all edges */}
      <div className="bg-white w-full  flex items-center justify-start">
        <Image
          src="/images/Logo/ALL PNG-01.png"
          alt="Oshaia"
          width={200}
          height={80}
          className="object-contain w-full h-auto max-h-20"
        />
      </div>

      {/* Role badge — flat left, rounded right only, sits right below logo */}
      <div className="pl-0 pr-4 pt-3 pb-3">
        <div className="bg-white text-black rounded-r-full pl-4 pr-5 py-2">
          <span className="text-black font-bold text-sm tracking-wide">{user?.name}</span>
        </div>
      </div>

      {/* Nav items — text only, no icons */}
      <nav className="flex-1 px-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ href, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 text-sm font-medium transition-colors rounded-lg
                ${active
                  ? 'text-[#c89c6b] bg-white/5'
                  : 'text-white/75 hover:text-white hover:bg-white/5'}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Log Out button */}
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
