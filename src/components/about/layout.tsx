'use client';

import { ReactNode } from 'react';
import WhatsAppButton from './WhatsAppButton';
import Header from './Header';
import Footer from '../HelpCenter/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="text-gray-800 font-sans">
      <main>{children}</main>
      <WhatsAppButton />
    </div>
  );
}