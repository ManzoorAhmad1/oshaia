'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Calendar, FileImage, Users,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Menu, X, BarChart3, Globe
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/cms', label: 'CMS / Content', icon: FileImage },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#112b38]">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#c89c6b]/20 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 border border-[#c89c6b]/40 flex items-center justify-center bg-[#0d2030]">
          <Image src="/images/Logo/ALL PNG-01.png" alt="Oshaia" width={32} height={32} className="object-contain w-7 h-7" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-extrabold text-white text-sm leading-none tracking-widest uppercase">Oshaia</p>
            <p className="text-xs text-[#c89c6b] mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Section label */}
      {!collapsed && (
        <p className="text-[10px] font-bold text-[#c89c6b]/50 uppercase tracking-widest px-5 pt-5 pb-1">Main Menu</p>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-[#c89c6b] text-white shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-[#c89c6b] group-hover:text-white'}`} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80" />}
            </Link>
          );
        })}
      </nav>

      {/* View site link */}
      {!collapsed && (
        <div className="px-3 py-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#c89c6b] hover:bg-white/10 transition-colors border border-[#c89c6b]/20"
          >
            <Globe className="w-4 h-4" />
            <span>View Website</span>
          </Link>
        </div>
      )}

      {/* User + Logout */}
      <div className="border-t border-[#c89c6b]/20 p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 mb-1 rounded-xl bg-white/5">
            <div className="w-7 h-7 rounded-full bg-[#c89c6b] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-300 flex-shrink-0 relative ${collapsed ? 'w-16' : 'w-64'}`}
        style={{ minHeight: '100vh' }}
      >
        <div className="sticky top-0 h-screen overflow-y-auto flex flex-col">
          <SidebarContent />
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 bg-[#c89c6b] border-0 rounded-full p-1 shadow-md z-20 hover:bg-[#b8885a] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
        </button>
      </aside>

      {/* Mobile: top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#112b38] border-b border-[#c89c6b]/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-1">
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="font-extrabold text-white text-sm tracking-widest uppercase">Oshaia Admin</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#c89c6b] flex items-center justify-center">
          <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex flex-col shadow-2xl bg-[#112b38]">
            <div className="flex justify-end p-3 border-b border-[#c89c6b]/20">
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <X className="w-5 h-5 text-white/70 hover:text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
