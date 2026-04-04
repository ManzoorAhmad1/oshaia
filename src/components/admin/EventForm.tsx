'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import { Loader2, Upload, Globe, EyeOff, Plus, Trash2 } from 'lucide-react';
// X imported for potential future use — kept for modal close button usage by consumers
import toast from 'react-hot-toast';

const CATEGORIES = ['concert', 'festival', 'conferences', 'show', 'sport', 'international'];
const BADGES = ['', 'TRENDING', 'HOT', 'NEW'];

interface TicketType {
  name: { en: string; fr: string };
  price: number;
  currency: string;
  totalSeats: number;
  description: { en: string; fr: string };
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
  isPublic: boolean;
  coverImage: string;
  ticketTypes: TicketType[];
}

interface Props {
  initialData?: Partial<EventFormData> & { _id?: string };
  mode: 'create' | 'edit';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultTicket = (): TicketType => ({
  name: { en: '', fr: '' },
  price: 0,
  currency: 'RS',
  totalSeats: 100,
  description: { en: '', fr: '' },
});

const defaultForm = (): EventFormData => ({
  title: { en: '', fr: '' },
  category: 'concert',
  description: { en: '', fr: '' },
  venue: { en: '', fr: '' },
  address: { en: '', fr: '' },
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  badge: '',
  isPublic: false,
  coverImage: '',
  ticketTypes: [defaultTicket()],
});

export default function EventForm({ initialData, mode, onSuccess, onCancel }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>(() => ({
    ...defaultForm(),
    ...initialData,
    title: { en: '', fr: '', ...initialData?.title },
    description: { en: '', fr: '', ...initialData?.description },
    venue: { en: '', fr: '', ...initialData?.venue },
    address: { en: '', fr: '', ...initialData?.address },
    ticketTypes: initialData?.ticketTypes?.length ? initialData.ticketTypes : [defaultTicket()],
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
  }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Field helpers ──────────────────────────────────────────────────────
  const setField = (path: string, value: any) => {
    setForm((prev) => {
      const clone = { ...prev } as any;
      const keys = path.split('.');
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const updateTicket = (idx: number, field: string, value: any) => {
    setForm((prev) => {
      const tickets = [...prev.ticketTypes];
      const keys = field.split('.');
      let obj: any = tickets[idx];
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return { ...prev, ticketTypes: tickets };
    });
  };

  // ── Upload cover image ─────────────────────────────────────────────────
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setField('coverImage', data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (mode === 'create') {
        await api.post('/events', form);
        toast.success('Event created!');
      } else {
        await api.patch(`/events/${initialData?._id}`, form);
        toast.success('Event updated!');
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/events');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* ── Title ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Title</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">English *</span>
            <input required value={form.title.en} onChange={(e) => setField('title.en', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">French</span>
            <input value={form.title.fr} onChange={(e) => setField('title.fr', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
          </label>
        </div>
      </section>

      {/* ── Cover Image ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Cover Image</h2>
        <div className="flex items-start gap-4">
          {form.coverImage && (
            <img
              src={getImageUrl(form.coverImage)}
              className="w-32 h-24 object-cover rounded-lg border border-gray-200"
              alt="Cover"
            />
          )}
          <div className="space-y-2 flex-1">
            <input
              type="text"
              placeholder="Image URL (or upload below)"
              value={form.coverImage}
              onChange={(e) => setField('coverImage', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
            />
            <button type="button" onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Category / Badge / Visibility ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">Category *</span>
            <select required value={form.category} onChange={(e) => setField('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">Badge</span>
            <select value={form.badge} onChange={(e) => setField('badge', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]">
              {BADGES.map((b) => <option key={b} value={b}>{b || 'None'}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">Visibility</span>
            <button
              type="button"
              onClick={() => setField('isPublic', !form.isPublic)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                form.isPublic ? 'bg-green-50 border-green-300 text-green-700' : 'bg-orange-50 border-orange-300 text-orange-700'
              }`}
            >
              {form.isPublic ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {form.isPublic ? 'Public' : 'Private'}
            </button>
          </label>
        </div>
      </section>

      {/* ── Date & Time ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Date & Time</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Start Date *', field: 'startDate', type: 'date', required: true },
            { label: 'End Date', field: 'endDate', type: 'date', required: false },
            { label: 'Start Time', field: 'startTime', type: 'time', required: false },
            { label: 'End Time', field: 'endTime', type: 'time', required: false },
          ].map(({ label, field, type, required }) => (
            <label key={field} className="block">
              <span className="text-sm font-medium text-gray-600 mb-1 block">{label}</span>
              <input
                type={type}
                required={required}
                value={(form as any)[field]}
                onChange={(e) => setField(field, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
              />
            </label>
          ))}
        </div>
      </section>

      {/* ── Venue & Address ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Venue & Address</h2>
        {(['venue', 'address'] as const).map((field) => (
          <div key={field} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-600 mb-1 block">{field.charAt(0).toUpperCase() + field.slice(1)} (EN)</span>
              <input value={form[field].en} onChange={(e) => setField(`${field}.en`, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-600 mb-1 block">{field.charAt(0).toUpperCase() + field.slice(1)} (FR)</span>
              <input value={form[field].fr} onChange={(e) => setField(`${field}.fr`, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
            </label>
          </div>
        ))}
      </section>

      {/* ── Description ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Description</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">English</span>
            <textarea rows={4} value={form.description.en} onChange={(e) => setField('description.en', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-600 mb-1 block">French</span>
            <textarea rows={4} value={form.description.fr} onChange={(e) => setField('description.fr', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] resize-none" />
          </label>
        </div>
      </section>

      {/* ── Ticket Types ── */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Ticket Types</h2>
          <button type="button" onClick={() => setForm((p) => ({ ...p, ticketTypes: [...p.ticketTypes, defaultTicket()] }))}
            className="flex items-center gap-1.5 text-sm text-[#c89c6b] hover:text-purple-900">
            <Plus className="w-4 h-4" /> Add Ticket Type
          </button>
        </div>
        {form.ticketTypes.map((ticket, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Ticket #{idx + 1}</p>
              {form.ticketTypes.length > 1 && (
                <button type="button" onClick={() => setForm((p) => ({ ...p, ticketTypes: p.ticketTypes.filter((_, i) => i !== idx) }))}
                  className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Name (EN)</span>
                <input value={ticket.name.en} onChange={(e) => updateTicket(idx, 'name.en', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Name (FR)</span>
                <input value={ticket.name.fr} onChange={(e) => updateTicket(idx, 'name.fr', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Price</span>
                <input type="number" min="0" value={ticket.price} onChange={(e) => updateTicket(idx, 'price', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500 mb-1 block">Total Seats</span>
                <input type="number" min="1" value={ticket.totalSeats} onChange={(e) => updateTicket(idx, 'totalSeats', Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]" />
              </label>
            </div>
          </div>
        ))}
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pb-8">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#112b38] text-white rounded-lg font-medium text-sm hover:bg-[#0d2030] transition-colors disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === 'create' ? 'Create Event' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => onCancel ? onCancel() : router.back()}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}


