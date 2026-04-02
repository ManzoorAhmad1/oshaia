'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Loader2, Save, Upload, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Default content (mirrors frontend fallbacks) ─────────────────────────
const SECTION_DEFAULTS: Record<string, Record<string, Partial<CmsSection>>> = {
  home: {
    hero: {
      title: { en: 'Beyond Your Journey', fr: 'Au-delà de votre voyage' },
      subtitle: { en: 'Discover the best events around you', fr: 'Découvrez les meilleurs événements autour de vous' },
      description: { en: '', fr: '' },
      buttonText: { en: 'Explore Events', fr: 'Explorer les événements' },
      buttonLink: '/events',
      image: '/Coveer Web-01-01.png',
      images: [],
    },
    events: {
      title: { en: 'Upcoming Events', fr: 'Événements à venir' },
      subtitle: { en: 'Don\'t miss out on the best events', fr: 'Ne manquez pas les meilleurs événements' },
    },
    partners: {
      title: { en: 'Our Partners', fr: 'Nos partenaires' },
      images: [],
    },
    newsletter: {
      title: { en: 'Subscribe to our newsletter', fr: 'Abonnez-vous à notre newsletter' },
    },
    topSeller: {
      title: { en: 'Top Sellers', fr: 'Meilleures ventes' },
    },
    bestOfSeason: {
      title: { en: 'Best of the Season', fr: 'Le meilleur de la saison' },
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

// ── CMS Page definitions ──────────────────────────────────────────────────
const CMS_PAGES = [
  {
    key: 'home',
    label: 'Home Page',
    sections: [
      { key: 'hero', label: 'Hero / Carousel' },
      { key: 'events', label: 'Events Section' },
      { key: 'partners', label: 'Partners Section' },
      { key: 'newsletter', label: 'Newsletter Section' },
      { key: 'topSeller', label: 'Top Seller Section' },
      { key: 'bestOfSeason', label: 'Best of Season' },
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
        const current = getSectionData(sectionKey);
        updateBuffer(sectionKey, 'images', [...(current.images || []), data.url]);
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
            const isDirty = !!editBuffer[sectionKey];

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

                    {/* Subtitle */}
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

                    {/* Description */}
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

                    {/* Button text + link */}
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

                    {/* Main image */}
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

                    {/* Image gallery */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Image Gallery (for carousels)</span>
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
                                const newImgs = (data.images || []).filter((_, i) => i !== imgIdx);
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

                    {/* Extra custom fields — key/value pairs */}
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
                    </div>

                    {/* Save button */}
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
