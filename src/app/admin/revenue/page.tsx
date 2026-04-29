'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Loader2, Banknote, TrendingUp, RefreshCcw, XCircle, Clock } from 'lucide-react';

interface BookingRow {
  id: number;
  bookingRef: string;
  eventId: number;
  totalAmount: number;
  paymentStatus: string;
  buyerName: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  paid:     'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  failed:   'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-500',
};

export default function RevenuePage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/admin/all')
      .then(res => setBookings(res.data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total    = bookings.reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const paid     = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const pending  = bookings.filter(b => b.paymentStatus === 'pending').reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);
  const refunded = bookings.filter(b => b.paymentStatus === 'refunded').reduce((s, b) => s + (Number(b.totalAmount) || 0), 0);

  const statusGroups = ['paid', 'pending', 'failed', 'refunded'].map(st => ({
    status: st,
    count: bookings.filter(b => b.paymentStatus === st).length,
    revenue: bookings.filter(b => b.paymentStatus === st).reduce((s, b) => s + (Number(b.totalAmount) || 0), 0),
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#c89c6b] flex items-center justify-center">
          <Banknote className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#112b38]">Revenue / Finance</h1>
          <p className="text-sm text-gray-500">Financial breakdown by payment status</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c89c6b]" /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#112b38] text-white rounded-2xl p-4">
              <p className="text-xs text-white/60">Total Revenue</p>
              <p className="text-2xl font-extrabold text-[#c89c6b] mt-1">Rs {total.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Paid</p>
              <p className="text-2xl font-extrabold text-green-600 mt-1">Rs {paid.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-extrabold text-yellow-600 mt-1">Rs {pending.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs text-gray-500">Refunded</p>
              <p className="text-2xl font-extrabold text-gray-500 mt-1">Rs {refunded.toLocaleString()}</p>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="font-bold text-[#112b38] mb-4">Breakdown by Payment Status</h2>
            <div className="space-y-3">
              {statusGroups.map(sg => {
                const pct = total > 0 ? Math.round((sg.revenue / total) * 100) : 0;
                return (
                  <div key={sg.status}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[sg.status] || 'bg-gray-100 text-gray-500'}`}>
                          {sg.status}
                        </span>
                        <span className="text-xs text-gray-500">{sg.count} bookings</span>
                      </div>
                      <span className="text-sm font-bold text-gray-700">Rs {sg.revenue.toLocaleString()} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-2 rounded-full bg-[#c89c6b] transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent bookings */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#112b38]">Recent Transactions</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="py-16 text-center text-gray-400">No transactions yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Ref</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Buyer</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Amount</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Status</th>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.slice(0, 20).map(b => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-mono text-xs text-gray-600">{b.bookingRef}</td>
                        <td className="px-5 py-3 text-gray-800">{b.buyerName}</td>
                        <td className="px-5 py-3 font-bold text-gray-800">Rs {Number(b.totalAmount).toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.paymentStatus] || 'bg-gray-100 text-gray-500'}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
