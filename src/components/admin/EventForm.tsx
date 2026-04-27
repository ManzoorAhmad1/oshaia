'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import {
  Loader2, Upload, Globe, EyeOff, Plus, Trash2,
  Link2, Gift, Music, Image as ImageIcon, Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['concert', 'festival', 'conferences', 'show', 'sport', 'international'];


interface TicketType {
  name: { en: string; fr: string };
  price: number;
  processingFee: number;
  discount: number;
  discountType: 'flat' | 'percent';
  currency: string;
  totalSeats: number;
  availableSeats: number;
  expiryDate: string;
  description: { en: string; fr: string };
  buy1Get1: boolean;
}

interface SponsorTicket {
  sponsorName: string;
  ticketName: string;
  quantity: number;
  remarks: string;
}

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  spotify?: string;
  other?: string;
}

interface Song {
  spotifyUrl: string;
}

interface EventFormData {
  title: { en: string; fr: string };
  category: string;
  description: { en: string; fr: string };
  venue: { en: string; fr: string };
  address: { en: string; fr: string };
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  badge: string;
  earlyBird: boolean;
  bookingLink: string;
  isPublic: boolean;
  // Banners
  bannerSquare: string;
  bannerLandscape: string;
  bannerBgBlur: string;
  // Homepage Placement
  showInHeroCarousel: boolean;
  heroImage: string;
  heroVideo: string;
  showInTopEventsCarousel: boolean;
  topEventsImage: string;
  // Event Details
  detailsBanner: string;
  detailsVideo: string;
  // Schedule
  isScheduled: boolean;
  scheduledAt: string;
  // Tickets
  ticketTypes: TicketType[];
  sponsorTickets: SponsorTicket[];
  // Social
  socialLinks: SocialLinks;
  songs: Song[];
  // Site Plan
  sitePlanImage: string;
}

interface Props {
  initialData?: Partial<EventFormData> & { id?: string; _id?: string };
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

// â”€â”€ Defaults â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const defaultTicket = (): TicketType => ({
  name: { en: '', fr: '' },
  price: 0,
  processingFee: 0,
  discount: 0,
  discountType: 'flat',
  currency: 'RS',
  totalSeats: 0,
  availableSeats: 0,
  expiryDate: '',
  description: { en: '', fr: '' },
  buy1Get1: false,
});

const defaultSponsorTicket = (): SponsorTicket => ({
  sponsorName: '', ticketName: '', quantity: 1, remarks: '',
});

const defaultForm = (): EventFormData => ({
  title: { en: '', fr: '' },
  category: 'concert',
  description: { en: '', fr: '' },
  venue: { en: '', fr: '' },
  address: { en: '', fr: '' },
  startDate: '', endDate: '', startTime: '', endTime: '',
  badge: '', earlyBird: false, bookingLink: '', isPublic: false,
  bannerSquare: '', bannerLandscape: '', bannerBgBlur: '',
  showInHeroCarousel: false, heroImage: '', heroVideo: '',
  showInTopEventsCarousel: false, topEventsImage: '',
  detailsBanner: '', detailsVideo: '',
  isScheduled: false, scheduledAt: '',
  ticketTypes: [defaultTicket()],
  sponsorTickets: [],
  socialLinks: {},
  songs: [],
  sitePlanImage: '',
});

// â”€â”€ Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${checked ? 'bg-[#c89c6b]' : 'bg-gray-300'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

// â”€â”€ File Upload Field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FileUploadField({ label, value, onChange, hint, accept = 'image/*' }: {
  label: string; value: string; onChange: (url: string) => void; hint?: string; accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const isVideo = accept.includes('video');

  const upload = async (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(data.url); toast.success('Uploaded!');
    } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  return (
    <div className="space-y-1.5">
      {label && <span className="text-xs font-medium text-gray-600 block">{label}</span>}
      <div className="flex items-center gap-2">
        <input type="file" accept={accept} ref={ref} className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#112b38]/30 rounded text-xs text-[#112b38] hover:bg-[#112b38]/5 transition-colors disabled:opacity-60">
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? 'Uploading...' : 'Choose file'}
        </button>
        <span className="text-xs text-gray-400 truncate max-w-[180px]">{value ? value.split('/').pop() : 'No file chosen'}</span>
      </div>
      {value && (
        isVideo
          ? <video src={getImageUrl(value)} className="h-16 rounded border border-gray-200 mt-1" controls muted />
          : <img src={getImageUrl(value)} className="h-16 object-cover rounded border border-gray-200 mt-1" alt="" />
      )}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

// â”€â”€ Section Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionCard({ title, icon, badge, children }: { title: string; icon?: React.ReactNode; badge?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#c89c6b]/20 bg-[#112b38]">
        <div className="flex items-center gap-2">{icon && <span className="opacity-80">{icon}</span>}<h3 className="font-semibold text-sm text-white">{title}</h3></div>
        {badge && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#c89c6b]/25 text-[#c89c6b]">{badge}</span>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// â”€â”€ Main Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function EventForm({ initialData, mode, onSuccess, onCancel }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>(() => ({
    ...defaultForm(),
    ...initialData,
    title: { en: '', fr: '', ...initialData?.title },
    description: { en: '', fr: '', ...initialData?.description },
    venue: { en: '', fr: '', ...initialData?.venue },
    address: { en: '', fr: '', ...initialData?.address },
    socialLinks: { ...(initialData?.socialLinks ?? {}) },
    ticketTypes: initialData?.ticketTypes?.length ? initialData.ticketTypes : [defaultTicket()],
    sponsorTickets: (initialData as any)?.sponsorTickets ?? [],
    songs: (initialData as any)?.songs ?? [],
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    scheduledAt: (initialData as any)?.scheduledAt ? new Date((initialData as any).scheduledAt).toISOString().slice(0, 16) : '',
  }));
  const [saving, setSaving] = useState(false);

  const setField = (path: string, value: any) => {
    setForm((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const updateTicket = (idx: number, field: string, value: any) => {
    setForm((prev) => {
      const tickets = JSON.parse(JSON.stringify(prev.ticketTypes));
      const keys = field.split('.');
      let obj: any = tickets[idx];
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return { ...prev, ticketTypes: tickets };
    });
  };

  const updateSponsor = (idx: number, field: keyof SponsorTicket, value: any) => {
    setForm((prev) => {
      const sponsors = [...prev.sponsorTickets];
      sponsors[idx] = { ...sponsors[idx], [field]: value };
      return { ...prev, sponsorTickets: sponsors };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, coverImage: (form as any).bannerLandscape || (form as any).bannerSquare || (initialData as any)?.coverImage || '' };
      if (mode === 'create') { await api.post('/events', payload); toast.success('Event created!'); }
      else { await api.patch(`/events/${initialData?.id || initialData?._id}`, payload); toast.success('Event updated!'); }
      if (onSuccess) onSuccess();
      else { router.push('/admin/events'); router.refresh(); }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save event');
    } finally { setSaving(false); }
  };

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] focus:border-[#c89c6b] bg-white';
  const sinp = 'w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] focus:border-[#c89c6b] bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {/* ── LEFT COLUMN (main content) ── */}
        <div className="xl:col-span-2 space-y-5">

      {/* â”€â”€ Basic Information â”€â”€ */}
      <SectionCard title="Basic Information" icon={<span className="text-orange-500 text-base">â„¹</span>}>
        <div className="space-y-4">
          {/* Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Event Name (EN) *</span>
              <input required value={form.title.en} onChange={(e) => setField('title.en', e.target.value)} className={inp} placeholder="Event Name" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Event Name (FR)</span>
              <input value={form.title.fr} onChange={(e) => setField('title.fr', e.target.value)} className={inp} placeholder="Nom de l'Ã©vÃ©nement" />
            </label>
          </div>
          {/* Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Short Description (EN)</span>
              <textarea rows={3} value={form.description.en} onChange={(e) => setField('description.en', e.target.value)} className={inp + ' resize-none'} placeholder="Short description" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Short Description (FR)</span>
              <textarea rows={3} value={form.description.fr} onChange={(e) => setField('description.fr', e.target.value)} className={inp + ' resize-none'} placeholder="Courte description" />
            </label>
          </div>
          {/* Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Event Date *', field: 'startDate', type: 'date', required: true },
              { label: 'End Date', field: 'endDate', type: 'date', required: false },
              { label: 'Event Time *', field: 'startTime', type: 'time', required: true },
              { label: 'End Time', field: 'endTime', type: 'time', required: false },
            ].map(({ label, field, type, required }) => (
              <label key={field} className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">{label}</span>
                <input type={type} required={required} value={(form as any)[field]} onChange={(e) => setField(field, e.target.value)} className={inp} />
              </label>
            ))}
          </div>
          {/* Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Location (EN) *', field: 'venue.en', ph: 'Venue, City' },
              { label: 'Location (FR)', field: 'venue.fr', ph: 'Lieu, Ville' },
              { label: 'Full Address (EN)', field: 'address.en', ph: 'Full address' },
              { label: 'Full Address (FR)', field: 'address.fr', ph: 'Adresse complÃ¨te' },
            ].map(({ label, field, ph }) => (
              <label key={field} className="block">
                <span className="text-xs font-medium text-gray-600 mb-1 block">{label}</span>
                <input value={field.split('.').reduce((o: any, k) => o?.[k], form) ?? ''} onChange={(e) => setField(field, e.target.value)} className={inp} placeholder={ph} />
              </label>
            ))}
          </div>
          {/* Category / Badge / Status / Early Bird */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 items-end">
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Category</span>
              <select value={form.category} onChange={(e) => setField('category', e.target.value)} className={inp}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Event Badge</span>
              <select value={form.badge} onChange={(e) => setField('badge', e.target.value)} className={inp}>
                <option value="">— None —</option>
                {[
                  'FINAL RELEASE', 'LIMITED TICKETS', 'BUY 2 GET 1 FREE', 'LAST CHANCE',
                  'FLASH SALE', 'PHASE 4', 'PHASE 3', 'PHASE 2', 'PHASE 1',
                  'EXCLUSIVE', 'SELLING FAST', 'EARLY ACCESS', 'EARLY BIRD',
                  'SOLD OUT', 'LAST TICKETS',
                ].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600 mb-1 block">Status</span>
              <button type="button" onClick={() => setField('isPublic', !form.isPublic)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${form.isPublic ? 'bg-green-50 border-green-300 text-green-700' : 'bg-[#112b38]/5 border-[#112b38]/20 text-[#112b38]'}`}>
                {form.isPublic ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {form.isPublic ? 'Published' : 'Draft'}
              </button>
            </label>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div>
                <p className="text-xs font-medium text-gray-700">Early Bird</p>
                <p className="text-[11px] text-gray-400">Adds ribbon on card</p>
              </div>
              <Toggle checked={form.earlyBird} onChange={(v) => setField('earlyBird', v)} />
            </div>
          </div>
          {/* External Booking Link */}
          <div>
            <span className="text-xs font-medium text-gray-600 mb-1 block">External Ticket URL (optional)</span>
            <input type="url" placeholder="https://..." value={form.bookingLink} onChange={(e) => setField('bookingLink', e.target.value)} className={inp} />
            <p className="text-[11px] text-gray-400 mt-1">If set, "Buy/Get" links to this URL.</p>
          </div>
        </div>
      </SectionCard>

      {/* â”€â”€ Ticket Types â”€â”€ */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#c89c6b]/20 bg-[#112b38]">
          <h3 className="font-semibold text-sm text-white">Ticket Types</h3>
          <button type="button" onClick={() => setForm((p) => ({ ...p, ticketTypes: [...p.ticketTypes, defaultTicket()] }))}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg hover:bg-[#b8895a] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="p-5 space-y-4">
          {form.ticketTypes.map((ticket, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ticket #{idx + 1}</p>
                {form.ticketTypes.length > 1 && (
                  <button type="button" onClick={() => setForm((p) => ({ ...p, ticketTypes: p.ticketTypes.filter((_, i) => i !== idx) }))}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Remove Ticket
                  </button>
                )}
              </div>
              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Ticket Name (EN) *</span>
                  <input placeholder="e.g. General Admission" value={ticket.name.en} onChange={(e) => updateTicket(idx, 'name.en', e.target.value)} className={sinp} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Ticket Name (FR)</span>
                  <input placeholder="e.g. Admission GÃ©nÃ©rale" value={ticket.name.fr} onChange={(e) => updateTicket(idx, 'name.fr', e.target.value)} className={sinp} />
                </div>
              </div>
              {/* Price / Fee / Quantity */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Price (â‚¨) *</span>
                  <input type="number" min="0" value={ticket.price} onFocus={(e) => e.target.select()} onChange={(e) => updateTicket(idx, 'price', Number(e.target.value))} className={sinp} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Fee (â‚¨)</span>
                  <input type="number" min="0" value={ticket.processingFee} onFocus={(e) => e.target.select()} onChange={(e) => updateTicket(idx, 'processingFee', Number(e.target.value))} className={sinp} placeholder="0" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Quantity</span>
                  <input type="number" min="0" value={ticket.totalSeats} onFocus={(e) => e.target.select()} onChange={(e) => {
                    const v = Number(e.target.value);
                    updateTicket(idx, 'totalSeats', v);
                    if (ticket.availableSeats === ticket.totalSeats) updateTicket(idx, 'availableSeats', v);
                  }} className={sinp} />
                </div>
              </div>
              {/* Description */}
              <div>
                <span className="text-xs text-gray-500 mb-1 block">Description (optional)</span>
                <textarea rows={2} placeholder="Brief description of this ticket tier..." value={ticket.description.en} onChange={(e) => updateTicket(idx, 'description.en', e.target.value)} className={sinp + ' resize-none'} />
              </div>
              {/* Discount */}
              <div className="border border-dashed border-gray-300 rounded-lg p-3 space-y-2">
                <span className="text-xs font-semibold text-gray-600">Discount Codes for this Ticket</span>
                <div className="grid grid-cols-4 gap-2 items-end">
                  <div>
                    <span className="text-[11px] text-gray-400 mb-0.5 block">Type</span>
                    <select value={ticket.discountType} onChange={(e) => updateTicket(idx, 'discountType', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white">
                      <option value="percent">Percentage</option>
                      <option value="flat">Flat Amount</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 mb-0.5 block">Value</span>
                    <input type="number" min="0" placeholder="0" value={ticket.discount || ''} onFocus={(e) => e.target.select()} onChange={(e) => updateTicket(idx, 'discount', Number(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 mb-0.5 block">Limit (expiry)</span>
                    <input type="date" value={ticket.expiryDate} onChange={(e) => updateTicket(idx, 'expiryDate', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                  <div className="flex items-end pb-0.5">
                    {ticket.discount > 0 && (
                      <p className="text-[11px] text-[#c89c6b] font-semibold">
                        Final: â‚¨{(ticket.discountType === 'percent'
                          ? ticket.price - ticket.price * (ticket.discount / 100)
                          : ticket.price - ticket.discount
                        ).toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Buy 1 Get 1 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-dashed border-gray-200">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">Buy 1 Get 1 Free</p>
                    <p className="text-[11px] text-gray-400">User pays for 1 ticket and gets 2</p>
                  </div>
                </div>
                <Toggle checked={ticket.buy1Get1} onChange={(v) => updateTicket(idx, 'buy1Get1', v)} />
              </div>
              {/* Seats bar */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all" style={{
                    width: ticket.totalSeats > 0 ? `${Math.round((ticket.availableSeats / ticket.totalSeats) * 100)}%` : '0%',
                    backgroundColor: (ticket.availableSeats / ticket.totalSeats) > 0.3 ? '#22c55e' : (ticket.availableSeats / ticket.totalSeats) > 0.1 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">{ticket.availableSeats}/{ticket.totalSeats} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ Sponsor Tickets â”€â”€ */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#c89c6b]/20 bg-[#112b38]">
          <div className="flex items-center gap-2">
            <span className="text-[#c89c6b]">🎟</span>
            <h3 className="font-semibold text-sm text-white">Sponsor Tickets (Admin Only)</h3>
          </div>
          <button type="button" onClick={() => setForm((p) => ({ ...p, sponsorTickets: [...p.sponsorTickets, defaultSponsorTicket()] }))}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#c89c6b] text-white rounded-lg hover:bg-[#b8895a] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="p-5 space-y-4">
          {form.sponsorTickets.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No sponsor tickets added yet.</p>}
          {form.sponsorTickets.map((sp, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Sponsor Name</span>
                  <input value={sp.sponsorName} onChange={(e) => updateSponsor(idx, 'sponsorName', e.target.value)} className={sinp} placeholder="Sponsor / VIP name" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Ticket Name</span>
                  <input value={sp.ticketName} onChange={(e) => updateSponsor(idx, 'ticketName', e.target.value)} className={sinp} placeholder="e.g. VIP Access" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Quantity</span>
                  <input type="number" min="1" value={sp.quantity} onFocus={(e) => e.target.select()} onChange={(e) => updateSponsor(idx, 'quantity', Number(e.target.value))} className={sinp} />
                </div>
                <div>
                  <span className="text-xs text-gray-500 mb-1 block">Remarks (optional)</span>
                  <textarea rows={1} value={sp.remarks} onChange={(e) => updateSponsor(idx, 'remarks', e.target.value)} className={sinp + ' resize-none'} />
                </div>
              </div>
              <button type="button" onClick={() => setForm((p) => ({ ...p, sponsorTickets: p.sponsorTickets.filter((_, i) => i !== idx) }))}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ Homepage Placement â”€â”€ */}
        </div>{/* ── end LEFT COLUMN ── */}

        {/* ── RIGHT COLUMN (sidebar) ── */}
        <div className="space-y-5">
          {/* ── Event Banners ── */}
          <SectionCard title="Event Banners" icon={<ImageIcon className="w-4 h-4 text-[#c89c6b]" />}>
            <div className="space-y-4">
              <FileUploadField label="Banner 1 (Square)" value={form.bannerSquare} onChange={(url) => setField('bannerSquare', url)} hint="Recommended: 1080×1080 (1:1)" />
              <FileUploadField label="Banner 2 (Landscape)" value={form.bannerLandscape} onChange={(url) => setField('bannerLandscape', url)} hint="Recommended: 1600×900 (16:9)" />
              <FileUploadField label="Banner 3 (Background Blur)" value={form.bannerBgBlur} onChange={(url) => setField('bannerBgBlur', url)} hint="Used as blurred hero background" />
            </div>
          </SectionCard>

          <SectionCard title="Homepage Placement" badge="Optional">
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Show in "Latest" (Hero) Carousel</p>
                <p className="text-xs text-gray-400">Appears in the top homepage carousel</p>
              </div>
              <Toggle checked={form.showInHeroCarousel} onChange={(v) => setField('showInHeroCarousel', v)} />
            </div>
            {form.showInHeroCarousel && (
              <div className="space-y-3 pl-2 border-l-2 border-[#c89c6b]/40">
                <FileUploadField label="Hero Image" value={form.heroImage} onChange={(url) => setField('heroImage', url)} hint="Recommended: 1600×900 (16:9). Fallbacks to Banner 1 if empty." />
                <FileUploadField label="Hero Video (optional)" value={form.heroVideo} onChange={(url) => setField('heroVideo', url)} hint="Upload a promotional video (MP4, max 50MB)." accept="video/mp4,video/webm" />
              </div>
            )}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Show in "Top Events" Carousel</p>
                <p className="text-xs text-gray-400">Appears in the small carousel section.</p>
              </div>
              <Toggle checked={form.showInTopEventsCarousel} onChange={(v) => setField('showInTopEventsCarousel', v)} />
            </div>
            {form.showInTopEventsCarousel && (
              <div className="pl-2 border-l-2 border-[#c89c6b]/40">
                <FileUploadField label="Top Events Image" value={form.topEventsImage} onChange={(url) => setField('topEventsImage', url)} hint="Recommended: 1200×900 (4:3). Fallbacks to Banner 2 if empty." />
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Event Details Banner & Video ── */}
      <SectionCard title="Event Details Banner & Video" badge="Optional">
        <p className="text-xs text-gray-400 mb-3">Used in the Event Details page. Upload one image and/or video.</p>
        <div className="space-y-4">
          <FileUploadField label="Event Details Banner (Image)" value={form.detailsBanner} onChange={(url) => setField('detailsBanner', url)} hint="Recommended: 1600×1080 (16:9)" />
          <FileUploadField label="Event Details Video (optional)" value={form.detailsVideo} onChange={(url) => setField('detailsVideo', url)} hint="Upload a short MP4 clip (max 50 MB)." accept="video/mp4,video/webm" />
        </div>
      </SectionCard>

      {/* ── Social Links ── */}
      <SectionCard title="Social Links" icon={<Link2 className="w-4 h-4 text-blue-400" />}>
        <p className="text-xs text-gray-400 mb-3">Shown only if provided</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'facebook', ph: 'https://facebook.com/...' },
            { key: 'instagram', ph: 'https://instagram.com/...' },
            { key: 'youtube', ph: 'https://youtube.com/...' },
            { key: 'linkedin', ph: 'https://linkedin.com/...' },
            { key: 'spotify', ph: 'https://open.spotify.com/...' },
            { key: 'other', ph: 'https://...' },
          ].map(({ key, ph }) => (
            <input key={key} type="url" placeholder={ph} value={(form.socialLinks as any)[key] ?? ''} onChange={(e) => setField(`socialLinks.${key}`, e.target.value)} className={sinp} />
          ))}
        </div>
      </SectionCard>

      {/* ── Spotify Songs ── */}
      <SectionCard title="Spotify Songs (max 20)" icon={<Music className="w-4 h-4 text-green-500" />}>
        <div className="space-y-2">
          {form.songs.map((song, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input type="url" placeholder="Spotify track link" value={song.spotifyUrl} onChange={(e) => {
                const songs = [...form.songs]; songs[idx] = { spotifyUrl: e.target.value };
                setForm((p) => ({ ...p, songs }));
              }} className={sinp} />
              <button type="button" onClick={() => setForm((p) => ({ ...p, songs: p.songs.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {form.songs.length < 20 && (
            <button type="button" onClick={() => setForm((p) => ({ ...p, songs: [...p.songs, { spotifyUrl: '' }] }))} className="flex items-center gap-1.5 text-xs text-[#112b38] hover:text-[#c89c6b] font-medium mt-1 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Song
            </button>
          )}
        </div>
      </SectionCard>

      {/* ── Static Plan Image ── */}
      <SectionCard title="Static Plan Image" icon={<ImageIcon className="w-4 h-4 text-blue-500" />}>
        <p className="text-xs text-gray-400 mb-3">Upload an image that shows event directions or layout.</p>
        <FileUploadField label="" value={form.sitePlanImage} onChange={(url) => setField('sitePlanImage', url)} hint="Recommended: PNG/JPG under 3MB. Uploading a new one replaces the old." />
      </SectionCard>

      {/* ── Schedule Visibility ── */}
      <SectionCard title="Schedule Visibility" icon={<Calendar className="w-4 h-4 text-purple-500" />}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Schedule this event to be posted later</p>
            <Toggle checked={form.isScheduled} onChange={(v) => setField('isScheduled', v)} />
          </div>
          {form.isScheduled && (
              <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-[#c89c6b]/40">
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Scheduled Date</span>
                <input type="date" value={form.scheduledAt.split('T')[0] || ''} onChange={(e) => setField('scheduledAt', `${e.target.value}T${form.scheduledAt.split('T')[1] || '00:00'}`)} className={sinp} />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Scheduled Time</span>
                <input type="time" value={form.scheduledAt.split('T')[1]?.slice(0, 5) || ''} onChange={(e) => setField('scheduledAt', `${form.scheduledAt.split('T')[0] || new Date().toISOString().split('T')[0]}T${e.target.value}`)} className={sinp} />
              </label>
            </div>
          )}
        </div>
      </SectionCard>

        </div>{/* ── end RIGHT COLUMN ── */}

      </div>{/* ── end grid ── */}

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-2 pb-8">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#112b38] text-white rounded-lg font-semibold text-sm hover:bg-[#0d2030] transition-colors disabled:opacity-60 border border-[#c89c6b]/30 shadow">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'create' ? 'Save Event' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => onCancel ? onCancel() : router.back()}
          className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

