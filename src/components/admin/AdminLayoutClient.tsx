'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/context/AuthContext';

const PUBLIC_PATHS = ['/admin/login'];

type Role = 'admin' | 'organizer' | 'moderator' | 'scanner' | 'ticket_runner' | 'user';

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Main Admin',
  organizer: 'Organizer',
  moderator: 'Moderator',
  scanner: 'Scanner',
  ticket_runner: 'Ticket Runner',
  user: 'User',
};

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic) return <>{children}</>;

  const role = (user?.role || 'user') as Role;

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top header — user card on the right */}
          <header className="flex items-center justify-end  bg-white flex-shrink-0">
            <div className="flex items-center gap-3 bg-gray-300/70 rounded-bl-2xl px-4 py-2 shadow-sm">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">{user?.name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#c89c6b] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                {user?.avatar
                  ? <Image src={user.avatar} alt={user?.name || 'User'} width={40} height={40} className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>}
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
