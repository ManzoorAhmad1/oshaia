'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, ShoppingBag, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Order {
  id: string;
  user?: { name: string; email: string };
  event?: { title: { en: string } };
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  ticketCount?: number;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  paid:     'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  failed:   'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
};

export default function OrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    api.get('/bookings/admin/all')
      .then(res => setOrders(res.data.bookings || res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o =>
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.event?.title?.en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#112b38]">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">All ticket purchase orders</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by buyer or event..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here after ticket purchases</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Buyer</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Event</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Tickets</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.user?.name || '—'}</p>
                      <p className="text-xs text-gray-500">{order.user?.email || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{order.event?.title?.en || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{order.ticketCount ?? '—'}</td>
                    <td className="px-4 py-3 font-semibold text-[#112b38]">Rs {order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
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
