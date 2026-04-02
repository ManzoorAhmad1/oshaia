'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

// Public admin paths that don't need the guard or sidebar
const PUBLIC_PATHS = ['/admin/login'];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic) return <>{children}</>;

  return (
    <AdminGuard>
      <div className="flex h-screen overflow-hidden bg-[#f0f4f7] relative">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden mt-14 md:mt-0 min-w-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
