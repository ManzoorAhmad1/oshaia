'use client';

import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ScanResult {
  status: 'success' | 'error';
  message: string;
  ticket?: {
    ticketCode: string;
    eventTitle?: string;
    holderName?: string;
    ticketType?: string;
    usedAt?: string;
  };
}

export default function ScannerPage() {
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (code: string) => {
    if (!code.trim()) return;
    setScanning(true);
    setResult(null);
    try {
      const { data } = await api.post('/tickets/scan', { ticketCode: code.trim() });
      setResult({
        status: 'success',
        message: data.message || 'Ticket validated successfully!',
        ticket: data.ticket,
      });
      toast.success('Ticket valid!');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid or already used ticket.';
      setResult({ status: 'error', message: msg });
      toast.error(msg);
    } finally {
      setScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualCode);
    setManualCode('');
  };

  const reset = () => {
    setResult(null);
    setManualCode('');
    inputRef.current?.focus();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-[#112b38]">Ticket Scanner</h1>
        <p className="text-gray-500 text-sm mt-0.5">Scan or enter a ticket code to validate entry.</p>
      </div>

      {/* Manual entry form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#112b38]">
          <QrCode className="w-5 h-5 text-[#c89c6b]" />
          <span className="font-semibold text-sm">Enter Ticket Code</span>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Scan QR or type ticket code..."
            autoComplete="off"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c89c6b]"
          />
          <button
            type="submit"
            disabled={scanning || !manualCode.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#112b38] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2030] transition-colors disabled:opacity-60 border border-[#c89c6b]/30"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            {scanning ? 'Checking...' : 'Validate'}
          </button>
        </form>

        <p className="text-xs text-gray-400">
          Tip: If using a barcode/QR scanner device, just scan — the code will auto-submit.
        </p>
      </div>

      {/* Scan result */}
      {result && (
        <div className={`rounded-xl border p-5 space-y-3 ${
          result.status === 'success'
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.status === 'success'
                ? <CheckCircle className="w-6 h-6 text-green-600" />
                : <XCircle className="w-6 h-6 text-red-600" />}
              <span className={`font-bold text-base ${result.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {result.status === 'success' ? 'VALID TICKET' : 'INVALID TICKET'}
              </span>
            </div>
            <button onClick={reset} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors" title="Scan another">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <p className={`text-sm ${result.status === 'success' ? 'text-green-700' : 'text-red-600'}`}>
            {result.message}
          </p>

          {result.ticket && (
            <div className="bg-white rounded-lg border border-green-200 p-4 space-y-2 text-sm">
              {result.ticket.eventTitle && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Event</span>
                  <span className="font-medium text-gray-800">{result.ticket.eventTitle}</span>
                </div>
              )}
              {result.ticket.holderName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Holder</span>
                  <span className="font-medium text-gray-800">{result.ticket.holderName}</span>
                </div>
              )}
              {result.ticket.ticketType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-800">{result.ticket.ticketType}</span>
                </div>
              )}
              {result.ticket.ticketCode && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Code</span>
                  <span className="font-mono text-xs text-gray-600">{result.ticket.ticketCode}</span>
                </div>
              )}
              {result.ticket.usedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Scanned at</span>
                  <span className="text-gray-600">{new Date(result.ticket.usedAt).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!result && (
        <div className="bg-[#112b38]/5 rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold text-[#112b38]">How to use</p>
          <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
            <li>Connect a USB QR/barcode scanner — it acts as a keyboard</li>
            <li>The input box is auto-focused; just scan and it will validate instantly</li>
            <li>Or type the ticket code manually and press Validate</li>
            <li>Green = valid entry, Red = already used or invalid</li>
          </ul>
        </div>
      )}
    </div>
  );
}
