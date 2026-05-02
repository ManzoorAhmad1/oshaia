'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { clearCmsCache } from '@/lib/useCms';
import {
  Loader2, Plus, Trash2, Save, Upload, Megaphone,
  Globe, Monitor, CalendarDays, LayoutGrid, ToggleLeft, ToggleRight, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Types ─────────────────────────────────────────────────────────────────
export interface Ad {
  id: string;
  image: string;
  link: string;
  position: 'all' | 'home' | 'events' | 'event-detail';
  isActive: boolean;
  title?: string;
}

const POSITION_LABELS: Record<Ad['position'], { label: string; icon: React.ReactNode; color: string }> = {
  all:          { label: 'All Pages',    icon: <Globe className="w-3.5 h-3.5" />,       color: 'bg-purple-100 text-purple-700 border-purple-200' },
  home:         { label: 'Home Page',    icon: <Monitor className="w-3.5 h-3.5" />,     color: 'bg-blue-100 text-blue-700 border-blue-200' },
  events:       { label: 'Events List',  icon: <LayoutGrid className="w-3.5 h-3.5" />,  color: 'bg-amber-100 text-amber-700 border-amber-200' },
  'event-detail': { label: 'Event Page', icon: <CalendarDays className="w-3.5 h-3.5" />, color: 'bg-green-100 text-green-700 border-green-200' },
};

// ── Helpers ───────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdsManagerPage() {
  const [ads, setAds]           = useState<Ad[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [dirty, setDirty]       = useState(false);

  // new-ad form
  const [newImage, setNewImage]         = useState('');
  const [newLink, setNewLink]           = useState('');
  const [newPosition, setNewPosition]   = useState<Ad['position']>('all');
  const [newTitle, setNewTitle]         = useState('');
  const [uploadingNew, setUploadingNew] = useState(false);
  // per-card upload
  const [uploadingIdx, setUploadingIdx] = useState<string | null>(null);

  // ── Load ads from CMS ─────────────────────────────────────────────────
  const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cms/page/ads');
      const raw = data.content?.list?.extra?.ads;
      const parsed: Ad[] = raw ? JSON.parse(raw) : [];
      setAds(Array.isArray(parsed) ? parsed : []);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAds(); }, [loadAds]);

  // ── Persist ads to CMS ────────────────────────────────────────────────
  const saveAds = async (updatedAds: Ad[]) => {
    setSaving(true);
    try {
      await api.put('/cms/page/ads/list', {
        pageKey: 'ads',
        sectionKey: 'list',
        extra: { ads: JSON.stringify(updatedAds) },
      });
      clearCmsCache('ads');
      setDirty(false);
      toast.success('Ads saved successfully!');
    } catch {
      toast.error('Failed to save ads.');
    } finally {
      setSaving(false);
    }
  };

  const mutate = (updated: Ad[]) => {
    setAds(updated);
    setDirty(true);
  };

  // ── Upload image ──────────────────────────────────────────────────────
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url || data.path || data.filename || '';
  };

  // ── Add ad ────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!newImage) { toast.error('Please upload or enter an image URL.'); return; }
    if (!newLink)  { toast.error('Please enter a destination link.'); return; }
    const ad: Ad = { id: uid(), image: newImage, link: newLink, position: newPosition, isActive: true, title: newTitle };
    mutate([...ads, ad]);
    setNewImage(''); setNewLink(''); setNewTitle(''); setNewPosition('all');
  };

  // ── Toggle active ─────────────────────────────────────────────────────
  const toggleActive = (id: string) => {
    mutate(ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const deleteAd = (id: string) => {
    mutate(ads.filter(a => a.id !== id));
  };

  // ── Update field ──────────────────────────────────────────────────────
  const updateAd = (id: string, field: keyof Ad, value: Ad[keyof Ad]) => {
    mutate(ads.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c89c6b] flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#112b38]">Ads Manager</h1>
            <p className="text-xs text-gray-400 mt-0.5">Upload once — ads appear automatically across the platform</p>
          </div>
        </div>
        {dirty && (
          <button
            onClick={() => saveAds(ads)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#112b38] hover:bg-[#1a3f50] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        )}
      </div>

      {/* ── Position legend ──────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(POSITION_LABELS) as [Ad['position'], typeof POSITION_LABELS[Ad['position']]][]).map(([pos, meta]) => (
          <span key={pos} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${meta.color}`}>
            {meta.icon} {meta.label}
          </span>
        ))}
        <span className="text-xs text-gray-400 self-center ml-1">— where each ad appears</span>
      </div>

      {/* ── Add New Ad ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-[#112b38] uppercase tracking-wide">Add New Ad</h2>

        {/* Image upload or URL */}
        <div className="flex items-start gap-3">
          {/* Preview */}
          <div className="w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
            {newImage
              ? <img src={getImageUrl(newImage, '')} alt="" className="w-full h-full object-cover" />
              : <Megaphone className="w-6 h-6 text-gray-300" />}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Image URL (or upload →)"
                value={newImage}
                onChange={e => setNewImage(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c89c6b] focus:ring-1 focus:ring-[#c89c6b]/30"
              />
              <label className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border-2 border-dashed border-[#c89c6b] text-[#c89c6b] rounded-xl text-sm font-semibold cursor-pointer hover:bg-[#c89c6b]/5 transition-colors ${uploadingNew ? 'opacity-60 pointer-events-none' : ''}`}>
                {uploadingNew ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload
                <input type="file" accept="image/*,video/*" className="hidden" onChange={async e => {
                  const f = e.target.files?.[0]; if (!f) return;
                  setUploadingNew(true);
                  try { const url = await uploadImage(f); setNewImage(url); } catch { toast.error('Upload failed'); }
                  finally { setUploadingNew(false); }
                }} />
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Destination link (e.g. /event or https://...)"
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c89c6b] focus:ring-1 focus:ring-[#c89c6b]/30"
              />
              <input
                type="text"
                placeholder="Caption (optional)"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-40 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c89c6b] focus:ring-1 focus:ring-[#c89c6b]/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={newPosition}
                onChange={e => setNewPosition(e.target.value as Ad['position'])}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#c89c6b] bg-white"
              >
                {(Object.keys(POSITION_LABELS) as Ad['position'][]).map(p => (
                  <option key={p} value={p}>{POSITION_LABELS[p].label}</option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 bg-[#c89c6b] hover:bg-[#b8894f] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Ad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Existing Ads ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#c89c6b]" />
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
          <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No ads yet</p>
          <p className="text-xs text-gray-300 mt-1">Add your first ad above</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#112b38] uppercase tracking-wide">
            Active Ads ({ads.filter(a => a.isActive).length} / {ads.length} active)
          </h2>
          {ads.map((ad) => {
            const pos = POSITION_LABELS[ad.position];
            return (
              <div
                key={ad.id}
                className={`bg-white border rounded-2xl p-4 flex items-start gap-4 transition-all ${
                  ad.isActive ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-60'
                }`}
              >
                {/* Preview */}
                <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100 relative">
                  {ad.image
                    ? <img src={getImageUrl(ad.image, '')} alt={ad.title || 'Ad'} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Megaphone className="w-6 h-6 text-gray-300" /></div>}
                  {/* replace image */}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                    {uploadingIdx === ad.id
                      ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                      : <Upload className="w-5 h-5 text-white" />}
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={async e => {
                      const f = e.target.files?.[0]; if (!f) return;
                      setUploadingIdx(ad.id);
                      try { const url = await uploadImage(f); updateAd(ad.id, 'image', url); } catch { toast.error('Upload failed'); }
                      finally { setUploadingIdx(null); }
                    }} />
                  </label>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${pos.color}`}>
                      {pos.icon} {pos.label}
                    </span>
                    {ad.title && <span className="text-xs text-gray-500 truncate">{ad.title}</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ad.link}
                      onChange={e => updateAd(ad.id, 'link', e.target.value)}
                      placeholder="Destination link"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c89c6b]"
                    />
                    <input
                      type="text"
                      value={ad.title || ''}
                      onChange={e => updateAd(ad.id, 'title', e.target.value)}
                      placeholder="Caption"
                      className="w-36 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#c89c6b]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={ad.position}
                      onChange={e => updateAd(ad.id, 'position', e.target.value as Ad['position'])}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#c89c6b] bg-white"
                    >
                      {(Object.keys(POSITION_LABELS) as Ad['position'][]).map(p => (
                        <option key={p} value={p}>{POSITION_LABELS[p].label}</option>
                      ))}
                    </select>
                    {ad.link && (
                      <a
                        href={ad.link.startsWith('http') ? ad.link : ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-[#c89c6b] flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Preview link
                      </a>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(ad.id)}
                    title={ad.isActive ? 'Click to hide this ad' : 'Click to show this ad'}
                    className="flex items-center gap-1 text-xs font-semibold transition-colors"
                  >
                    {ad.isActive
                      ? <ToggleRight className="w-8 h-8 text-green-500" />
                      : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                  </button>
                  <span className={`text-[10px] font-bold ${ad.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                    {ad.isActive ? 'LIVE' : 'OFF'}
                  </span>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bottom save bar ───────────────────────────────────────────── */}
      {dirty && (
        <div className="sticky bottom-4 flex justify-end">
          <button
            onClick={() => saveAds(ads)}
            disabled={saving}
            className="flex items-center gap-2 bg-[#112b38] hover:bg-[#1a3f50] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xl transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save {ads.length} Ad{ads.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
