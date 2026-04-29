'use client';
import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';

export default function MarketingPage() {
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

      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <Mail className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-400 mb-2">Coming Soon</h3>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">Email and Whatsapp automation will be available once Zoho SMTP and Whatsapp Business API credentials are configured.</p>
      </div>
    </div>
  );
}
