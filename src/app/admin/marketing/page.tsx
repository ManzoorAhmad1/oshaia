'use client';
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Mail, MessageCircle, Loader2, Users } from 'lucide-react';

interface Subscriber { id: number; email: string; createdAt: string; }

export default function MarketingPage() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/subscribers')
      .then(res => setSubs(res.data.subscribers || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = subs.filter(s => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#112b38]">Email - Whatsapp</h1>
        <p className="text-sm text-gray-500 mt-1">Marketing automation via Zoho Mail and Whatsapp</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#c89c6b]/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-[#c89c6b]" />
          </div>
          <h3 className="font-bold text-[#112b38]">Email Campaigns</h3>
          <p className="text-sm text-gray-500">Send bulk emails via Zoho Mail. Reminder emails, cancellation notices, and promotional campaigns.</p>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">Zoho Integration Required</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-bold text-[#112b38]">Whatsapp Messaging</h3>
          <p className="text-sm text-gray-500">Send ticket confirmations and event reminders directly via Whatsapp Business API.</p>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">Whatsapp API Required</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c89c6b]" />
            <h3 className="font-bold text-[#112b38]">Newsletter Subscribers</h3>
            <span className="text-xs bg-[#c89c6b]/10 text-[#c89c6b] px-2 py-0.5 rounded-full font-semibold">{subs.length}</span>
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search email..."
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b] w-56"
          />
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-[#c89c6b]" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <Mail className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">{subs.length === 0 ? 'No subscribers yet' : 'No match found'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-500">#</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-500">Email</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-500">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3 font-medium text-[#112b38]">{s.email}</td>
                    <td className="px-5 py-3 text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
