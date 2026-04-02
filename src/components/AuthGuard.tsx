'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowModal(true);
    }
    // If admin lands on a user-only page after login, redirect to admin
    if (!isLoading && isAuthenticated && user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // While checking auth, show nothing (PersistGate handles flash)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c89c6b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show login modal, blur background
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#112b38] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#c89c6b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="4" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#112b38] mb-2">Login Required</h2>
            <p className="text-gray-500 text-sm mb-5">Please login to access this page.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-[#112b38] text-white rounded-lg font-semibold hover:bg-[#0d2030] transition-colors"
            >
              Login
            </button>
          </div>
        </div>
        {showModal && (
          <AuthModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            initialMode="login"
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}
