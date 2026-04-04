'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import EventForm from '@/components/admin/EventForm';
import { Loader2, Save, Upload, Plus, Trash2, ChevronDown, ChevronUp, Pencil, Globe, EyeOff, CalendarDays, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ── CmsEvent type (for inline event manager) ─────────────────────────────
interface CmsEvent {
  _id: string;
  title: { en: string; fr: string };
  description?: { en: string; fr: string };
  venue?: { en: string; fr: string };
  address?: { en: string; fr: string };
  category: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  badge?: string;
  isPublic: boolean;
  coverImage?: string;
  ticketTypes?: Array<{ name: { en: string; fr: string }; price: number; currency: string; totalSeats: number; description: { en: string; fr: string } }>;
}

// ── Default content (mirrors frontend fallbacks) ─────────────────────────
const SECTION_DEFAULTS: Record<string, Record<string, Partial<CmsSection>>> = {
  home: {
    hero: {
      image: '/Coveer Web-01-01.png', // HeroCarousel.tsx uses only this field
    },
    events: {
      title: { en: 'Upcoming Events', fr: 'Événements à venir' },
      subtitle: { en: 'Don\'t miss out on the best events', fr: 'Ne manquez pas les meilleurs événements' },
    },
    partners: {
      title: { en: 'Our Partners', fr: 'Nos partenaires' },
      images: [],
    },
    topSeller: {
      extra: {
        slides: JSON.stringify([
          { image: '/TOP%20SLLER/22054_9834dd51a16eba240c0c6c97a5237e74-0-en1771488562.jpg', title: 'Bel Suono: Three Pianos World Hits Gala', date: 'FEB 21 NOV', price: '500' },
          { image: '/TOP%20SLLER/22078_75ef9ba7a61c8303513ef023de00195d-0-en1771489174.jpg', title: 'Big 5 Concert: Stars of Arabic Music Live', date: 'MAR 15 DEC', price: '350' },
          { image: '/TOP%20SLLER/22099_3899b925d49dbee2814e0c1278a6dc64-0-en1771579388.jpg', title: 'Sessions: The Ultimate Live Music Experience', date: 'APR 20 JAN', price: '450' },
        ]),
        bottomImages: JSON.stringify([
          '/TOP%20SLLER/22054_9834dd51a16eba240c0c6c97a5237e74-0-en1771488562.jpg',
          '/TOP%20SLLER/22078_75ef9ba7a61c8303513ef023de00195d-0-en1771489174.jpg',
          '/TOP%20SLLER/22099_3899b925d49dbee2814e0c1278a6dc64-0-en1771579388.jpg',
        ]),
      },
    },
    platinumlist: {
      title: { en: 'Why buy with Oshaia?', fr: 'Pourquoi acheter avec Oshaia ?' },
      subtitle: { en: 'Mauritius Event Tickets', fr: 'Billets d\'événements à Maurice' },
      image: '/Red Simple Typographic 2026 Christmas Supplies Logo.png',
      extra: {
        desc1en: 'Mauritius is a vibrant island with a rich calendar of concerts, festivals, cultural shows, and live entertainment throughout the year. With so many events happening across the island, finding the right experience that fits your interests, schedule, and budget can sometimes be challenging.',
        desc1fr: 'Maurice est une île vibrante avec un riche calendrier de concerts, festivals, spectacles culturels et divertissements tout au long de l\'année.',
        desc2en: 'Oshaia.com simplifies this process by offering a modern and reliable platform to discover and book the best events in Mauritius. Our platform continuously tracks upcoming events, helping users explore and secure their tickets in just a few simple steps.',
        desc2fr: 'Oshaia.com simplifie ce processus en offrant une plateforme moderne et fiable pour découvrir et réserver les meilleurs événements à Maurice.',
        desc3en: 'Designed with advanced technology, Oshaia.com provides a seamless, user-friendly, and easy-to-use experience. The platform is supported by highly secure encrypted payment systems, ensuring every transaction is safe, reliable, and protected.',
        desc3fr: 'Conçu avec une technologie avancée, Oshaia.com offre une expérience fluide et facile à utiliser, soutenue par des systèmes de paiement cryptés hautement sécurisés.',
        desc4en: 'Our mission is to connect people with the most exciting events across Mauritius while offering a convenient, secure, and eco-friendly digital ticketing solution. With Oshaia.com, discovering and booking event experiences becomes simple, efficient, and enjoyable.',
        desc4fr: 'Notre mission est de connecter les gens avec les événements les plus passionnants à Maurice tout en offrant une solution de billetterie numérique pratique, sécurisée et écologique.',
      },
    },
  },
  about: {
    hero: {
      title: { en: 'About Us', fr: 'À propos de nous' },
      subtitle: { en: 'Your trusted event ticketing platform', fr: 'Votre plateforme de billetterie de confiance' },
      image: '/About%20Us.jpeg',
    },
    whoWeAre: {
      title: { en: 'Who We Are', fr: 'Qui sommes-nous' },
      description: {
        en: 'Oshaia is a premier event ticketing platform dedicated to connecting people with extraordinary experiences. We partner with top event organizers to bring you the best in entertainment, culture, and more.',
        fr: 'Oshaia est une plateforme de billetterie d\'événements de premier plan dédiée à connecter les gens avec des expériences extraordinaires.',
      },
      image: '/about us small square.jpeg',
    },
    sponsors: {
      title: { en: 'Our Sponsors', fr: 'Nos sponsors' },
      images: [],
    },
    stats: {
      extra: { years: '5+', customers: '50,000+', events: '200+' },
    },
    whyChooseUs: {
      title: { en: 'Why Choose Us', fr: 'Pourquoi nous choisir' },
    },
    cta: {
      title: { en: 'Ready to experience something amazing?', fr: 'Prêt à vivre quelque chose d\'incroyable ?' },
      buttonText: { en: 'Browse Events', fr: 'Parcourir les événements' },
      buttonLink: '/events',
    },
  },
  footer: {
    main: {
      title: { en: 'Oshaia', fr: 'Oshaia' },
      description: {
        en: 'Beyond your journey — your trusted platform for events & ticketing.',
        fr: 'Au-delà de votre voyage — votre plateforme de confiance pour les événements et la billetterie.',
      },
    },
    social: {
      extra: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com',
        youtube: 'https://youtube.com',
      },
    },
    contact: {
      extra: {
        email: 'contact@oshaia.com',
        phone: '+230 5000 0000',
        address: 'Port Louis, Mauritius',
      },
    },
  },
  help: {
    hero: {
      title: { en: 'Help Center', fr: 'Centre d\'aide' },
      subtitle: { en: 'Get instant answers to your questions', fr: 'Obtenez des réponses instantanées à vos questions' },
      image: '/Help Center.jpeg',
    },
    faq: {
      title: { en: 'Frequently Asked Questions', fr: 'Questions fréquemment posées' },
    },
    contact: {
      title: { en: 'Still need help?', fr: 'Besoin d\'aide supplémentaire ?' },
      buttonText: { en: 'Contact Us', fr: 'Contactez-nous' },
    },
  },
};

// ── Field visibility config ─────────────────────────────────────────────────
// Sections NOT listed → show all fields. Sections listed → only true flags are shown.
type SectionFieldFlags = {
  showTitle?: boolean; showSubtitle?: boolean; showDescription?: boolean;
  showButton?: boolean; showImage?: boolean; showGallery?: boolean; showExtra?: boolean;
};
const SECTION_FIELD_CONFIG: Record<string, Record<string, SectionFieldFlags>> = {
  home: {
    hero:      { showImage: true },    // HeroCarousel.tsx — getCms('hero').image
    events:    {},                      // Managed via inline event manager
    partners:  { showGallery: true },   // PartnersSection.tsx — getCms('partners').images
    topSeller: {},                      // Managed via custom per-slide editor below
    platinumlist: { showTitle: true, showSubtitle: true, showImage: true }, // Custom paragraphs editor below
  },
};

// ── CMS Page definitions ──────────────────────────────────────────────────
const CMS_PAGES = [
  {
    key: 'home',
    label: 'Home Page',
    sections: [
      { key: 'hero', label: 'Hero / Carousel' },
      { key: 'events', label: 'Events Section' },
      { key: 'partners', label: 'Partners Section' },
      { key: 'topSeller', label: 'Top Seller Section' },
      { key: 'platinumlist', label: 'Why Buy / Payment / SEO Text' },
    ],
  },
  {
    key: 'about',
    label: 'About Page',
    sections: [
      { key: 'hero', label: 'Hero Section' },
      { key: 'whoWeAre', label: 'Who We Are' },
      { key: 'sponsors', label: 'Sponsors (Logo Gallery)' },
      { key: 'stats', label: 'Stats (Years, Customers, Events)' },
      { key: 'whyChooseUs', label: 'Why Choose Us' },
      { key: 'cta', label: 'Call to Action' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    sections: [
      { key: 'main', label: 'Footer Content' },
      { key: 'social', label: 'Social Links' },
      { key: 'contact', label: 'Contact Info' },
    ],
  },
  {
    key: 'help',
    label: 'Help Center',
    sections: [
      { key: 'hero', label: 'Help Hero' },
      { key: 'faq', label: 'FAQ Content' },
      { key: 'contact', label: 'Contact CTA' },
    ],
  },
];

interface CmsSection {
  _id?: string;
  pageKey: string;
  sectionKey: string;
  label?: string;
  title?: { en: string; fr: string };
  subtitle?: { en: string; fr: string };
  description?: { en: string; fr: string };
  buttonText?: { en: string; fr: string };
  buttonLink?: string;
  image?: string;
  images?: string[];
  extra?: Record<string, any>;
}

export default function AdminCmsPage() {
  const [activePage, setActivePage] = useState(CMS_PAGES[0].key);
  const [content, setContent] = useState<Record<string, CmsSection>>({});
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Record<string, CmsSection>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  // ── Inline event manager state ────────────────────────────────────────
  const [cmsEvents, setCmsEvents] = useState<CmsEvent[]>([]);
  const [cmsEventsLoading, setCmsEventsLoading] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CmsEvent | null>(null);

  // ── Top Seller per-slide editor state ────────────────────────────────
  type TopSlide = { image: string; title: string; date: string; price: string };
  const [topSellerSlides, setTopSellerSlides] = useState<TopSlide[]>([]);
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(null);
  const [topSellerBottomImages, setTopSellerBottomImages] = useState<string[]>([]);
  const [uploadingBottomIdx, setUploadingBottomIdx] = useState<number | null>(null);

  const updateTopSellerSlides = (newSlides: TopSlide[]) => {
    setTopSellerSlides(newSlides);
    setEditBuffer((prev) => {
      const current: any = prev['topSeller'] || getSectionData('topSeller');
      return {
        ...prev,
        topSeller: { ...current, extra: { ...((current.extra as any) || {}), slides: JSON.stringify(newSlides) } },
      };
    });
  };

  const updateTopSellerBottomImages = (newImages: string[]) => {
    setTopSellerBottomImages(newImages);
    setEditBuffer((prev) => {
      const current: any = prev['topSeller'] || getSectionData('topSeller');
      return {
        ...prev,
        topSeller: { ...current, extra: { ...((current.extra as any) || {}), bottomImages: JSON.stringify(newImages) } },
      };
    });
  };

  const uploadTopSlideImage = async (idx: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingSlideIdx(idx);
    try {
      const { data } = await api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updated = topSellerSlides.map((s, i) => i === idx ? { ...s, image: data.url } : s);
      updateTopSellerSlides(updated);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingSlideIdx(null);
    }
  };

  const uploadTopBottomImage = async (idx: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingBottomIdx(idx);
    try {
      const { data } = await api.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updated = topSellerBottomImages.map((img, i) => i === idx ? data.url : img);
      updateTopSellerBottomImages(updated);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingBottomIdx(null);
    }
  };

  const fetchCmsEvents = useCallback(async () => {
    setCmsEventsLoading(true);
    try {
      const { data } = await api.get('/events/admin/all');
      setCmsEvents(data.events || []);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setCmsEventsLoading(false);
    }
  }, []);

  const deleteCmsEvent = async (id: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    setDeletingEventId(id);
    try {
      await api.delete(`/events/${id}`);
      setCmsEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingEventId(null);
    }
  };

  const fetchPageContent = useCallback(async (pageKey: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/cms/page/${pageKey}`);
      setContent(data.content || {});
      setEditBuffer({});
      setExpandedSection(null);
    } catch {
      toast.error('Failed to load CMS content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPageContent(activePage); }, [activePage, fetchPageContent]);

  // Load events when home/events section is expanded
  useEffect(() => {
    if (activePage === 'home' && expandedSection === 'events') fetchCmsEvents();
  }, [activePage, expandedSection, fetchCmsEvents]);

  // Init top seller slides + bottom images when section expands
  useEffect(() => {
    if (activePage === 'home' && expandedSection === 'topSeller') {
      const extra = (editBuffer['topSeller'] ?? content['topSeller'])?.extra as any;
      const def = SECTION_DEFAULTS.home.topSeller.extra as any;
      // Upper slides
      try {
        const parsed = extra?.slides ? JSON.parse(extra.slides) : null;
        setTopSellerSlides(Array.isArray(parsed) && parsed.length > 0 ? parsed : JSON.parse(def?.slides || '[]'));
      } catch {
        try { setTopSellerSlides(JSON.parse(def?.slides || '[]')); } catch { setTopSellerSlides([]); }
      }
      // Bottom images
      try {
        const parsed = extra?.bottomImages ? JSON.parse(extra.bottomImages) : null;
        setTopSellerBottomImages(Array.isArray(parsed) && parsed.length > 0 ? parsed : JSON.parse(def?.bottomImages || '[]'));
      } catch {
        try { setTopSellerBottomImages(JSON.parse(def?.bottomImages || '[]')); } catch { setTopSellerBottomImages([]); }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, expandedSection]);

  const currentPage = CMS_PAGES.find((p) => p.key === activePage)!;

  // ── Get editable data for a section ──────────────────────────────────
  const getSectionData = (sectionKey: string): CmsSection => {
    if (editBuffer[sectionKey]) return editBuffer[sectionKey];
    const defaults = SECTION_DEFAULTS[activePage]?.[sectionKey] || {};
    const base: CmsSection = {
      pageKey: activePage,
      sectionKey,
      title: { en: '', fr: '' },
      subtitle: { en: '', fr: '' },
      description: { en: '', fr: '' },
      buttonText: { en: '', fr: '' },
      buttonLink: '',
      image: '',
      images: [],
      extra: {},
      ...defaults,
    };
    if (!content[sectionKey]) return base;
    // Merge: DB value wins, but fall back to defaults for empty strings
    const db = content[sectionKey];
    return {
      ...base,
      ...db,
      title: {
        en: db.title?.en || defaults.title?.en || '',
        fr: db.title?.fr || defaults.title?.fr || '',
      },
      subtitle: {
        en: db.subtitle?.en || defaults.subtitle?.en || '',
        fr: db.subtitle?.fr || defaults.subtitle?.fr || '',
      },
      description: {
        en: db.description?.en || defaults.description?.en || '',
        fr: db.description?.fr || defaults.description?.fr || '',
      },
      buttonText: {
        en: db.buttonText?.en || defaults.buttonText?.en || '',
        fr: db.buttonText?.fr || defaults.buttonText?.fr || '',
      },
      buttonLink: db.buttonLink || (defaults as CmsSection).buttonLink || '',
      image: db.image || (defaults as CmsSection).image || '',
      images: (db.images && db.images.length > 0) ? db.images : ((defaults as CmsSection).images || []),
      extra: Object.keys(db.extra || {}).length > 0 ? db.extra : ((defaults as CmsSection).extra || {}),
    };
  };

  const updateBuffer = (sectionKey: string, path: string, value: any) => {
    setEditBuffer((prev) => {
      const current = prev[sectionKey] || getSectionData(sectionKey);
      const clone = JSON.parse(JSON.stringify(current));
      const keys = path.split('.');
      let obj: any = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] = obj[keys[i]] || {};
      obj[keys[keys.length - 1]] = value;
      return { ...prev, [sectionKey]: clone };
    });
  };

  const saveSection = async (sectionKey: string) => {
    const data = editBuffer[sectionKey] || getSectionData(sectionKey);
    setSavingKey(sectionKey);
    try {
      const { data: res } = await api.put(`/cms/page/${activePage}/${sectionKey}`, data);
      setContent((prev) => ({ ...prev, [sectionKey]: res.section }));
      setEditBuffer((prev) => { const n = { ...prev }; delete n[sectionKey]; return n; });
      toast.success(`"${sectionKey}" saved!`);
    } catch {
      toast.error('Failed to save section');
    } finally {
      setSavingKey(null);
    }
  };

  const uploadImage = async (sectionKey: string, field: 'image' | 'slide', file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingKey(`${sectionKey}-${field}`);
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (field === 'image') {
        updateBuffer(sectionKey, 'image', data.url);
      } else {
        // Use only real saved images (buffer or DB), NOT defaults — defaults are display-only
        const realImages = editBuffer[sectionKey]?.images ?? content[sectionKey]?.images ?? [];
        updateBuffer(sectionKey, 'images', [...realImages, data.url]);
      }
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* ── Edit Event Modal ────────────────────────────────────────── */}
      {editingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingEvent(null); }}
        >
          <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
            style={{ maxHeight: 'calc(100vh - 24px)' }}>
            {/* Fixed header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white rounded-t-2xl border-b border-gray-200 shrink-0">
              <div className="min-w-0 pr-3">
                <h2 className="text-base sm:text-lg font-bold text-[#112b38] truncate">Edit Event</h2>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{editingEvent.title?.en}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <EventForm
                mode="edit"
                initialData={editingEvent as any}
                onSuccess={() => { setEditingEvent(null); fetchCmsEvents(); }}
                onCancel={() => setEditingEvent(null)}
              />
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#112b38]">CMS — Content Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Edit all page content and images for both languages.</p>
      </div>

      {/* Page tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-0">
        {CMS_PAGES.map((page) => (
          <button
            key={page.key}
            onClick={() => setActivePage(page.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              activePage === page.key
                ? 'border-[#c89c6b] text-[#112b38] bg-[#c89c6b]/10'
                : 'border-transparent text-gray-500 hover:text-[#112b38]'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading content...
        </div>
      ) : (
        <div className="space-y-4">
          {currentPage.sections.map(({ key: sectionKey, label }) => {
            const data = getSectionData(sectionKey);
            const isExpanded = expandedSection === sectionKey;
            const isDirty = !!editBuffer[sectionKey];          const _fc = SECTION_FIELD_CONFIG[activePage]?.[sectionKey];
          const show = {
            title:       _fc ? (_fc.showTitle       ?? false) : true,
            subtitle:    _fc ? (_fc.showSubtitle    ?? false) : true,
            description: _fc ? (_fc.showDescription ?? false) : true,
            button:      _fc ? (_fc.showButton      ?? false) : true,
            image:       _fc ? (_fc.showImage       ?? false) : true,
            gallery:     _fc ? (_fc.showGallery     ?? false) : true,
            extra:       _fc ? (_fc.showExtra       ?? false) : true,
          };
            return (
              <div key={sectionKey} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Section header — click to expand */}
                <button
                  type="button"
                  onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800">{label}</span>
                    {isDirty && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                        Unsaved
                      </span>
                    )}
                    {content[sectionKey] && !isDirty && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Saved
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>

                {/* Expanded editor */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">

                    {/* Title */}
                    {show.title && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Title (EN)</span>
                        <input
                          value={data.title?.en || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'title.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="English title..."
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Title (FR)</span>
                        <input
                          value={data.title?.fr || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'title.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="French title..."
                        />
                      </label>
                    </div>
                    )}

                    {/* Subtitle */}
                    {show.subtitle && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Subtitle (EN)</span>
                        <input
                          value={data.subtitle?.en || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'subtitle.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="English subtitle..."
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Subtitle (FR)</span>
                        <input
                          value={data.subtitle?.fr || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'subtitle.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="French subtitle..."
                        />
                      </label>
                    </div>
                    )}

                    {/* Description */}
                    {show.description && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description (EN)</span>
                        <textarea
                          rows={3}
                          value={data.description?.en || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'description.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                          placeholder="English description..."
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description (FR)</span>
                        <textarea
                          rows={3}
                          value={data.description?.fr || ''}
                          onChange={(e) => updateBuffer(sectionKey, 'description.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                          placeholder="French description..."
                        />
                      </label>
                    </div>
                    )}

                    {/* Button text + link */}
                    {show.button && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Button Text (EN)</span>
                        <input value={data.buttonText?.en || ''} onChange={(e) => updateBuffer(sectionKey, 'buttonText.en', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Button Text (FR)</span>
                        <input value={data.buttonText?.fr || ''} onChange={(e) => updateBuffer(sectionKey, 'buttonText.fr', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Button Link</span>
                        <input value={data.buttonLink || ''} onChange={(e) => updateBuffer(sectionKey, 'buttonLink', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          placeholder="/events" />
                      </label>
                    </div>
                    )}

                    {/* Main image */}
                    {show.image && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Main Image</span>
                      <div className="flex items-start gap-3 flex-wrap">
                        {data.image && (
                          <img
                            src={data.image.startsWith('/uploads')
                              ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${data.image}`
                              : data.image}
                            className="w-28 h-20 object-cover rounded-lg border border-gray-200"
                            alt="Section"
                          />
                        )}
                        <div className="flex-1 space-y-2 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={data.image || ''}
                            onChange={(e) => updateBuffer(sectionKey, 'image', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                          />
                          <label className={`flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors w-fit ${uploadingKey === `${sectionKey}-image` ? 'opacity-60 pointer-events-none' : ''}`}>
                            {uploadingKey === `${sectionKey}-image`
                              ? <Loader2 className="w-4 h-4 animate-spin" />
                              : <Upload className="w-4 h-4" />}
                            Upload
                            <input type="file" accept="image/*" className="hidden"
                              onChange={(e) => e.target.files?.[0] && uploadImage(sectionKey, 'image', e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Image gallery */}
                    {show.gallery && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {activePage === 'home' && sectionKey === 'partners'
                            ? 'Partner Logos'
                            : activePage === 'home' && sectionKey === 'topSeller'
                            ? 'Slide Images (fallback when no Trending events)'
                            : 'Image Gallery'}
                        </span>
                          <label className={`flex items-center gap-1.5 text-xs text-[#c89c6b] cursor-pointer hover:text-[#b8885a] ${uploadingKey === `${sectionKey}-slide` ? 'opacity-60 pointer-events-none' : ''}`}>
                          {uploadingKey === `${sectionKey}-slide` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                          Add Image
                          <input type="file" accept="image/*,video/*" className="hidden"
                            onChange={(e) => e.target.files?.[0] && uploadImage(sectionKey, 'slide', e.target.files[0])} />
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {(data.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="relative group">
                            <img
                              src={img.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${img}` : img}
                              className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                              alt={`slide ${imgIdx}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                // Use only real saved images (buffer or DB), NOT defaults
                                const realImages = editBuffer[sectionKey]?.images ?? content[sectionKey]?.images ?? [];
                                const newImgs = realImages.filter((_, i) => i !== imgIdx);
                                updateBuffer(sectionKey, 'images', newImgs);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    )}

                    {/* Extra custom fields — key/value pairs */}
                    {show.extra && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Custom Fields (key → value)</span>
                        <button
                          type="button"
                          onClick={() => {
                            const key = prompt('Field key (e.g. facebook, phone, address):');
                            if (key && key.trim()) {
                              const current = getSectionData(sectionKey).extra || {};
                              updateBuffer(sectionKey, 'extra', { ...current, [key.trim()]: '' });
                            }
                          }}
                          className="flex items-center gap-1 text-xs text-[#c89c6b] hover:text-[#b8885a] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Add Field
                        </button>
                      </div>
                      {Object.entries(data.extra || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2 mb-2">
                          <span className="w-28 text-xs text-gray-500 font-mono shrink-0">{k}</span>
                          <input
                            value={String(v || '')}
                            onChange={(e) => {
                              const current = getSectionData(sectionKey).extra || {};
                              updateBuffer(sectionKey, 'extra', { ...current, [k]: e.target.value });
                            }}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                            placeholder={`Value for ${k}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = { ...(getSectionData(sectionKey).extra || {}) };
                              delete current[k];
                              updateBuffer(sectionKey, 'extra', current);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>                    )}
                    {/* Save button */}
                    {(show.title || show.subtitle || show.description || show.button || show.image || show.gallery || show.extra) && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => saveSection(sectionKey)}
                        disabled={savingKey === sectionKey}
                        className="flex items-center gap-2 px-5 py-2 bg-[#112b38] text-white rounded-lg text-sm font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60 border border-[#c89c6b]/20"
                      >
                        {savingKey === sectionKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Section
                      </button>
                    </div>
                    )}

                    {/* ── Top Seller per-slide editor (home/topSeller only) ── */}
                    {activePage === 'home' && sectionKey === 'topSeller' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">Slides ({topSellerSlides.length})</span>
                            <p className="text-xs text-gray-400 mt-0.5">Each slide has its own image, title, date &amp; price. Used as fallback when no Trending events exist.</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateTopSellerSlides([...topSellerSlides, { image: '', title: '', date: '', price: '' }])}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg text-xs font-medium hover:bg-[#b8885a] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Slide
                            </button>
                            <button
                              type="button"
                              onClick={() => saveSection(sectionKey)}
                              disabled={savingKey === sectionKey}
                              className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60"
                            >
                              {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                              Save
                            </button>
                          </div>
                        </div>

                        {topSellerSlides.length === 0 ? (
                          <p className="text-sm text-gray-400 py-2">No slides. Click "Add Slide" to create one.</p>
                        ) : (
                          <div className="space-y-3">
                            {topSellerSlides.map((slide, idx) => (
                              <div key={idx} className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                                {/* Image col */}
                                <div className="shrink-0 flex flex-col gap-1.5">
                                  <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                    {slide.image ? (
                                      <img
                                        src={slide.image.startsWith('/uploads')
                                          ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${slide.image}`
                                          : slide.image}
                                        className="w-full h-full object-cover" alt=""
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                    )}
                                  </div>
                                  <label className={`flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors ${uploadingSlideIdx === idx ? 'opacity-60 pointer-events-none' : ''}`}>
                                    {uploadingSlideIdx === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                    Upload
                                    <input type="file" accept="image/*" className="hidden"
                                      onChange={(e) => e.target.files?.[0] && uploadTopSlideImage(idx, e.target.files[0])} />
                                  </label>
                                </div>

                                {/* Fields */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div className="sm:col-span-3">
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">Title</span>
                                    <input
                                      value={slide.title}
                                      onChange={(e) => updateTopSellerSlides(topSellerSlides.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                      placeholder="Event title..."
                                    />
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">Date</span>
                                    <input
                                      value={slide.date}
                                      onChange={(e) => updateTopSellerSlides(topSellerSlides.map((s, i) => i === idx ? { ...s, date: e.target.value } : s))}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                      placeholder="JUN 15"
                                    />
                                  </div>
                                  <div>
                                    <span className="text-xs text-gray-500 mb-1 block font-medium">Price</span>
                                    <input
                                      value={slide.price}
                                      onChange={(e) => updateTopSellerSlides(topSellerSlides.map((s, i) => i === idx ? { ...s, price: e.target.value } : s))}
                                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
                                      placeholder="500"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      onClick={() => updateTopSellerSlides(topSellerSlides.filter((_, i) => i !== idx))}
                                      className="flex items-center gap-1 px-2 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ── Bottom Banner Images ────────────────────────── */}
                        <div className="border-t border-gray-100 pt-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <span className="text-sm font-semibold text-[#112b38]">Bottom Banner Images ({topSellerBottomImages.length})</span>
                              <p className="text-xs text-gray-400 mt-0.5">Full-width banner carousel shown below the top slider.</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => updateTopSellerBottomImages([...topSellerBottomImages, ''])}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg text-xs font-medium hover:bg-[#b8885a] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Image
                            </button>
                          </div>

                          {topSellerBottomImages.length === 0 ? (
                            <p className="text-sm text-gray-400 py-2">No images. Click "Add Image" to add one.</p>
                          ) : (
                            <div className="flex flex-wrap gap-3">
                              {topSellerBottomImages.map((img, idx) => (
                                <div key={idx} className="relative group w-32 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                                  {img ? (
                                    <img
                                      src={img.startsWith('/uploads')
                                        ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '')}${img}`
                                        : img}
                                      className="w-full h-full object-cover" alt=""
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                  )}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                    <label className={`cursor-pointer p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors ${uploadingBottomIdx === idx ? 'opacity-60 pointer-events-none' : ''}`}>
                                      {uploadingBottomIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#112b38]" /> : <Upload className="w-3.5 h-3.5 text-[#112b38]" />}
                                      <input type="file" accept="image/*" className="hidden"
                                        onChange={(e) => e.target.files?.[0] && uploadTopBottomImage(idx, e.target.files[0])} />
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => updateTopSellerBottomImages(topSellerBottomImages.filter((_, i) => i !== idx))}
                                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                    </button>
                                  </div>
                                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">{idx + 1}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── Platinumlist SEO Paragraphs (home/platinumlist only) ── */}
                    {activePage === 'home' && sectionKey === 'platinumlist' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#112b38]">SEO Description Paragraphs</span>
                            <p className="text-xs text-gray-400 mt-0.5">4 paragraphs shown under the "Mauritius Event Tickets" heading.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => saveSection(sectionKey)}
                            disabled={savingKey === sectionKey}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#112b38] text-white rounded-lg text-xs font-medium hover:bg-[#0d2030] transition-colors disabled:opacity-60"
                          >
                            {savingKey === sectionKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            Save
                          </button>
                        </div>
                        {([1, 2, 3, 4] as const).map((n) => (
                          <div key={n} className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
                            <span className="text-xs font-semibold text-[#112b38]">Paragraph {n}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">EN</span>
                                <textarea
                                  rows={3}
                                  value={(getSectionData(sectionKey) as any)?.extra?.[`desc${n}en`] ?? (editBuffer[sectionKey] as any)?.extra?.[`desc${n}en`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.desc${n}en`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                  placeholder={`English paragraph ${n}...`}
                                />
                              </label>
                              <label className="block">
                                <span className="text-xs text-gray-500 mb-1 block">FR</span>
                                <textarea
                                  rows={3}
                                  value={(getSectionData(sectionKey) as any)?.extra?.[`desc${n}fr`] ?? (editBuffer[sectionKey] as any)?.extra?.[`desc${n}fr`] ?? ''}
                                  onChange={(e) => updateBuffer(sectionKey, `extra.desc${n}fr`, e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none"
                                  placeholder={`French paragraph ${n}...`}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Inline Event Manager (home/events only) ───────── */}
                    {activePage === 'home' && sectionKey === 'events' && (
                      <div className="mt-2 border-t border-gray-100 pt-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#112b38]">Event Cards ({cmsEvents.length})</span>
                          <Link
                            href="/admin/events/new"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg text-xs font-medium hover:bg-[#b8885a] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Event
                          </Link>
                        </div>

                        {cmsEventsLoading ? (
                          <div className="flex items-center gap-2 text-gray-400 py-4 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading events...
                          </div>
                        ) : cmsEvents.length === 0 ? (
                          <p className="text-sm text-gray-400 py-4">No events yet. Add your first event.</p>
                        ) : (
                          <div className="space-y-3">
                            {cmsEvents.map((ev) => (
                              <div key={ev._id} className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                                {/* Cover image */}
                                <div className="shrink-0 w-20 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                  {ev.coverImage ? (
                                    <img
                                      src={getImageUrl(ev.coverImage)}
                                      alt={ev.title?.en}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                                  )}
                                </div>

                                {/* Fields */}
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-gray-800 truncate">{ev.title?.en || '—'}</p>
                                      <p className="text-xs text-gray-500 truncate">{ev.title?.fr || '—'}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {ev.isPublic
                                        ? <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><Globe className="w-3 h-3" />Public</span>
                                        : <span className="flex items-center gap-0.5 text-xs text-gray-400 font-medium"><EyeOff className="w-3 h-3" />Hidden</span>
                                      }
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                                    <span><strong>Category:</strong> {ev.category}</span>
                                    {ev.badge && <span><strong>Badge:</strong> {ev.badge}</span>}
                                    {ev.startDate && (
                                      <span className="flex items-center gap-0.5">
                                        <CalendarDays className="w-3 h-3" />
                                        {new Date(ev.startDate).toLocaleDateString()}
                                        {ev.endDate ? ` → ${new Date(ev.endDate).toLocaleDateString()}` : ''}
                                      </span>
                                    )}
                                    {ev.startTime && <span><strong>Time:</strong> {ev.startTime}{ev.endTime ? ` – ${ev.endTime}` : ''}</span>}
                                    {ev.venue?.en && <span><strong>Venue:</strong> {ev.venue.en}</span>}
                                    {ev.address?.en && <span><strong>Address:</strong> {ev.address.en}</span>}
                                    {ev.description?.en && (
                                      <span className="w-full"><strong>Desc (EN):</strong> {ev.description.en.slice(0, 80)}{ev.description.en.length > 80 ? '…' : ''}</span>
                                    )}
                                    {ev.description?.fr && (
                                      <span className="w-full"><strong>Desc (FR):</strong> {ev.description.fr.slice(0, 80)}{ev.description.fr.length > 80 ? '…' : ''}</span>
                                    )}
                                    {ev.ticketTypes && ev.ticketTypes.length > 0 && (
                                      <span className="w-full">
                                        <strong>Tickets:</strong>{' '}
                                        {ev.ticketTypes.map((t, i) => (
                                          <span key={i}>{t.name?.en} ({t.currency} {t.price}, {t.totalSeats} seats){i < ev.ticketTypes!.length - 1 ? ' · ' : ''}</span>
                                        ))}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setEditingEvent(ev)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-[#112b38] border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteCmsEvent(ev._id)}
                                    disabled={deletingEventId === ev._id}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    {deletingEventId === ev._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
