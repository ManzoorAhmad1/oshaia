'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const STAFF_ROLES = ['admin', 'organizer', 'moderator', 'scanner', 'ticket_runner'];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !STAFF_ROLES.includes(user?.role || ''))) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#112b38]">
        <div className="w-10 h-10 border-4 border-[#c89c6b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !STAFF_ROLES.includes(user?.role || '')) return null;

  return <>{children}</>;
}
