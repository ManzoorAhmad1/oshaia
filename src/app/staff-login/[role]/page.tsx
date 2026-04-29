'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCms } from '@/lib/useCms';
import { getImageUrl } from '@/lib/imageUrl';

// Role config — label, icon emoji, redirect path
const ROLE_CONFIG: Record<string, { label: string; icon?: string; redirectTo: string }> = {
  admin:          { label: 'Main Admin Tickets', redirectTo: '/admin' },
  organizer:      { label: 'Organizer',           redirectTo: '/admin' },
  moderator:      { label: 'Moderator',           redirectTo: '/admin' },
  scanner:        { label: 'Scanner',             redirectTo: '/admin/scanner', icon: '🎫' },
  ticket_runner:  { label: 'Ticket Runner',       redirectTo: '/admin' },
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  scanner: (
    // Barcode scanner SVG icon
    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-[#c89c6b]" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7V5a2 2 0 012-2h2M2 17v2a2 2 0 002 2h2M22 7V5a2 2 0 00-2-2h-2M22 17v2a2 2 0 01-2 2h-2" />
      <line x1="7" y1="5" x2="7" y2="19" />
      <line x1="10" y1="5" x2="10" y2="19" />
      <line x1="13" y1="5" x2="13" y2="19" />
      <line x1="17" y1="5" x2="17" y2="19" />
    </svg>
  ),
};

export default function StaffLoginPage({ params }: { params: { role: string } }) {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const role = params.role.toLowerCase();
  const config = ROLE_CONFIG[role] ?? { label: role.charAt(0).toUpperCase() + role.slice(1), redirectTo: '/admin' };

  const { get: getCms, text: cmsText } = useCms('staff-login');
  const bgImage = getCms(role)?.image || getCms('default')?.image || '';
  const leftTitle = cmsText(role, 'title') || cmsText('default', 'title') || '';
  const leftDesc  = cmsText(role, 'description') || cmsText('default', 'description') || '';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Already logged-in? redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(config.redirectTo);
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      // Validate role match
      const allowed = ['admin', role];
      if (!allowed.includes(loggedUser.role)) {
        setError(`This login link is for ${config.label} accounts only.`);
        setLoading(false);
        return;
      }
      router.replace(config.redirectTo);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Unknown role — show 404-style
  if (!ROLE_CONFIG[role]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-400 mb-2">Invalid login link</p>
          <p className="text-sm text-gray-500">Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ────────────────────────────────────────────── */}
      <div
        className="hidden md:flex w-[46%] xl:w-[48%] flex-shrink-0 relative overflow-hidden"
        style={bgImage ? {
          backgroundImage: `url(${getImageUrl(bgImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {
          background: 'linear-gradient(180deg, #1b7fa3 0%, #0f4a62 40%, #0a2f3e 75%, #071e29 100%)',
        }}
      >
        {/* Dot-grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Bottom gradient fade so text reads well */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

        {/* "BY OSHAIA" — top left */}
        <div className="absolute top-10 left-10 z-10 flex flex-col gap-1">
          <img
            src="/images/Logo/ALL PNG-01.png"
            alt="Oshaia"
            className="w-24 object-contain brightness-0 invert opacity-90"
          />
        </div>

        {/* Center-bottom: huge role name like "district" */}
        <div className="relative z-10 flex flex-col justify-end w-full h-full px-10 pb-14">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#c89c6b] uppercase mb-3">
            BY OSHAIA
          </span>
          <h2
            className="font-black text-white uppercase leading-none"
            style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
          >
            {role === 'admin' ? 'Admin' : config.label}
          </h2>
          {leftDesc && (
            <p className="mt-4 text-sm text-white/65 leading-relaxed max-w-[260px]">
              {leftDesc}
            </p>
          )}
        </div>
      </div>

      {/* ── RIGHT: Login Form ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 sm:px-10 py-12">
        <div className="w-full max-w-[420px] space-y-7">

          {/* Logo (hidden on admin — it's shown on left panel) */}
          {role !== 'admin' && (
            <div className="flex items-center gap-3">
              <img src="/images/Logo/ALL PNG-01.png" alt="Oshaia" className="h-12 object-contain" />
              {ROLE_ICONS[role] && (
                <span className="text-4xl">{ROLE_ICONS[role]}</span>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{config.label}</h1>
            <p className="text-sm text-gray-500 mt-1">
              If you don&apos;t have an account yet, we&apos;ll create one for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm bg-gray-50 placeholder:text-gray-400"
            />

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Password"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm bg-gray-50 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-[#c89c6b] hover:underline cursor-pointer w-fit">
              Lost your password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg text-sm tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
