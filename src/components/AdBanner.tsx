'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCms } from '@/lib/useCms';
import { getImageUrl } from '@/lib/imageUrl';
import { X } from 'lucide-react';
import type { Ad } from '@/app/admin/ads/page';

interface AdBannerProps {
  /** Which position to show — matches the position field set in Ads Manager */
  position: Ad['position'];
  /** Optional className override for the wrapper */
  className?: string;
}

/**
 * AdBanner — reads ads from CMS (pageKey="ads") and renders ads for the
 * given `position`. Pass position="all" to show ALL active ads regardless of page.
 *
 * Usage:
 *   <AdBanner position="home" />
 *   <AdBanner position="events" />
 *   <AdBanner position="event-detail" />
 */
export default function AdBanner({ position, className = '' }: AdBannerProps) {
  const { get, loading } = useCms('ads');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Robustly extract ads — handle: extra as object, extra as string, ads as string, ads as array
  let allAds: Ad[] = [];
  try {
    let extra = get('list').extra;
    if (typeof extra === 'string') extra = JSON.parse(extra);  // in case extra itself is a string
    const raw = (extra as any)?.ads;
    if (Array.isArray(raw))           allAds = raw;
    else if (typeof raw === 'string') allAds = JSON.parse(raw);
  } catch { allAds = []; }

  // Show ads for this position OR "all"
  const visible = allAds.filter(
    ad => ad.isActive && !dismissed.has(ad.id) && (ad.position === position || ad.position === 'all')
  );

  if (loading && allAds.length === 0) return null;
  if (visible.length === 0) return null;

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {visible.map(ad => (
        <AdCard key={ad.id} ad={ad} onDismiss={id => setDismissed(prev => new Set([...prev, id]))} />
      ))}
    </div>
  );
}

function AdCard({ ad, onDismiss }: { ad: Ad; onDismiss: (id: string) => void }) {
  const imageUrl = getImageUrl(ad.image, '');

  const inner = (
    <div className="relative w-full overflow-hidden rounded-2xl group cursor-pointer">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={ad.title || 'Advertisement'}
          className="w-full object-cover max-h-32 sm:max-h-40 md:max-h-52 transition-transform duration-500 group-hover:scale-105"
        />
      )}
      {/* Subtle AD label */}
      <span className="absolute top-2 left-2 text-[9px] font-bold text-white/70 bg-black/30 px-1.5 py-0.5 rounded uppercase tracking-widest">
        Ad
      </span>
      {/* Dismiss */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onDismiss(ad.id); }}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/30 text-white/80 hover:bg-black/50 hover:text-white transition-colors"
        aria-label="Dismiss ad"
      >
        <X className="w-3 h-3" />
      </button>
      {/* Caption overlay */}
      {ad.title && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-xs font-semibold truncate">{ad.title}</p>
        </div>
      )}
    </div>
  );

  if (!ad.link) return inner;

  const isExternal = ad.link.startsWith('http');
  if (isExternal) {
    return (
      <a href={ad.link} target="_blank" rel="noopener noreferrer sponsored">
        {inner}
      </a>
    );
  }
  return <Link href={ad.link}>{inner}</Link>;
}
