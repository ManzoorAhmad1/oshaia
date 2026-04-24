'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, X, Pencil, ExternalLink } from 'lucide-react';

const STAFF_ROLES = ['admin', 'organizer', 'moderator', 'scanner', 'ticket_runner'];

// Map user-facing paths to admin edit URLs
const getAdminEditUrl = (pathname: string): string | null => {
  if (pathname === '/') return '/admin/cms?page=home';
  if (pathname === '/about') return '/admin/cms?page=about';
  if (pathname === '/help') return '/admin/cms?page=help';
  if (pathname === '/terms') return '/admin/cms?page=terms';
  if (pathname === '/event') return '/admin/events';
  if (pathname.startsWith('/event/') && pathname.split('/').length === 3) {
    const id = pathname.split('/')[2];
    return `/admin/events/${id}/edit`;
  }
  return '/admin/cms';
};

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home Page',
  '/about': 'About Page',
  '/help': 'Help Center',
  '/terms': 'Terms & Conditions',
  '/event': 'Events Listing',
};

export default function AdminPreviewBar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismiss when path changes
  useEffect(() => { setDismissed(false); }, [pathname]);

  // Only show on user-facing pages (not /admin/*)
  if (pathname.startsWith('/admin')) return null;
  if (isLoading) return null;
  if (!user || !STAFF_ROLES.includes(user.role || '')) return null;
  if (dismissed) return null;

  const editUrl = getAdminEditUrl(pathname);
  const pageLabel = PAGE_LABELS[pathname] || (pathname.startsWith('/event/') ? 'Event Detail' : 'Page');

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-between gap-3 px-4 py-2 bg-[#112b38] text-white text-xs shadow-lg">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex items-center gap-1.5 bg-[#c89c6b]/20 border border-[#c89c6b]/40 rounded-full px-2.5 py-1 flex-shrink-0">
          <Eye className="w-3 h-3 text-[#c89c6b]" />
          <span className="text-[#c89c6b] font-semibold">Admin Preview</span>
        </div>
        <span className="text-white/60 hidden sm:block truncate">
          Viewing: <span className="text-white/90 font-medium">{pageLabel}</span>
          {user?.name && <> — logged in as <span className="text-[#c89c6b]">{user.name}</span></>}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {editUrl && (
          <a
            href={editUrl}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#c89c6b] hover:bg-[#b88c5b] text-[#112b38] font-semibold rounded-full transition-colors"
          >
            <Pencil className="w-3 h-3" />
            <span className="hidden sm:block">Edit Page</span>
            <span className="sm:hidden">Edit</span>
          </a>
        )}
        <a
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-1 border border-white/20 hover:bg-white/10 text-white rounded-full transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="hidden sm:block">Admin Panel</span>
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          title="Dismiss preview bar"
        >
          <X className="w-3.5 h-3.5 text-white/70" />
        </button>
      </div>
    </div>
  );
}
