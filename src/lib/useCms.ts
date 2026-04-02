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
}

type PageContent = Record<string, CmsSection>;

const cache: Record<string, PageContent> = {};

export function useCms(pageKey: string) {
  const [content, setContent] = useState<PageContent>(cache[pageKey] || {});
  const [loading, setLoading] = useState(!cache[pageKey]);

  useEffect(() => {
    if (cache[pageKey]) { setContent(cache[pageKey]); setLoading(false); return; }
    api.get(`/cms/page/${pageKey}`)
      .then(res => {
        const data: PageContent = res.data.content || {};
        cache[pageKey] = data;
        setContent(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey]);

  const get = (sectionKey: string): CmsSection => content[sectionKey] || {};

  const text = (sectionKey: string, field: keyof CmsSection, lang: 'en' | 'fr' = 'en'): string => {
    const sec = get(sectionKey);
    const val = sec[field] as { en: string; fr: string } | string | undefined;
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || val['en'] || '';
  };

  return { content, loading, get, text };
}
