'use client';

import { useState, useEffect } from 'react';
import api from './api';

export interface CmsSection {
  title?: { en: string; fr: string };
  subtitle?: { en: string; fr: string };
  description?: { en: string; fr: string };
  buttonText?: { en: string; fr: string };
  buttonLink?: string;
  image?: string;
  images?: string[];
  extra?: Record<string, any>;
  isVisible?: boolean;
}

type PageContent = Record<string, CmsSection>;

// Cache entry with a timestamp so we can expire it
interface CacheEntry {
  data: PageContent;
  fetchedAt: number;
}

const CACHE_TTL_MS = 30_000; // 30 seconds — user sees updates within 30s of admin saving

const cache: Record<string, CacheEntry> = {};

export function clearCmsCache(pageKey: string) {
  delete cache[pageKey];
}

export function clearAllCmsCache() {
  Object.keys(cache).forEach(k => delete cache[k]);
}

function isFresh(entry: CacheEntry | undefined): boolean {
  if (!entry) return false;
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

export function useCms(pageKey: string) {
  const fresh = isFresh(cache[pageKey]);
  const [content, setContent] = useState<PageContent>(cache[pageKey]?.data || {});
  const [loading, setLoading] = useState(!fresh);

  useEffect(() => {
    // Skip fetch only if cache is fresh
    if (isFresh(cache[pageKey])) {
      setContent(cache[pageKey].data);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get(`/cms/page/${pageKey}`)
      .then(res => {
        const data: PageContent = res.data.content || {};
        cache[pageKey] = { data, fetchedAt: Date.now() };
        setContent(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey]);

  const get = (sectionKey: string): CmsSection =>
    content[sectionKey] ?? content[sectionKey.toLowerCase()] ?? {};

  const text = (sectionKey: string, field: keyof CmsSection, lang: 'en' | 'fr' = 'en'): string => {
    const sec = get(sectionKey);
    const val = sec[field] as { en: string; fr: string } | string | undefined;
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val['en'] || '';
  };

  return { content, loading, get, text };
}
