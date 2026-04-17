"use client"

import React from 'react'
import Link from 'next/link'
import { FaLocationDot, FaTiktok } from "react-icons/fa6";

import { TfiEmail } from "react-icons/tfi";
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaYoutube, FaPhoneAlt } from 'react-icons/fa'
import { Text } from 'rizzui/typography'
import PartnersSection from './PartnersSection';
import NewsletterSection from './NewsletterSection';
import Platinumlist from './platinumlist';
import { useRouter } from 'next/navigation';
import { useCms } from '@/lib/useCms';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  const { get: getCms } = useCms('footer');
  const router=useRouter()

  const footerMain = getCms('main');
  const footerSocial = getCms('social');
  const footerContact = getCms('contact');
  const footerNav = getCms('navigation');

  const lang = language === 'fr' ? 'fr' : 'en';
  const ls = language === 'fr' ? 'Fr' : 'En';

  // Column headers from CMS (fallback to English defaults)
  const col1Header = footerNav.extra?.[`col1Header${ls}`] || (language === 'fr' ? 'À propos de nous' : 'About Us');
  const col2Header = footerNav.extra?.[`col2Header${ls}`] || (language === 'fr' ? 'Catégories' : 'Categories');
  const col3Header = footerNav.extra?.[`col3Header${ls}`] || 'Services';
  const col4Header = footerNav.extra?.[`col4Header${ls}`] || (language === 'fr' ? 'Client' : 'Customer');

  // Column links from CMS (JSON arrays)
  const parseLinks = (key: string, fallback: {label: string; href: string}[]): {label: string; href: string}[] => {
    try { const v = footerNav.extra?.[key]; if (v) { const p = JSON.parse(v); if (Array.isArray(p)) return p; } } catch {}
    return fallback;
  };
  const col1Links = parseLinks('col1Links', [
    { label: 'Who We Are ?', href: '/about' }, { label: 'Home', href: '/' }, { label: 'Events', href: '/event' },
    { label: 'Help Center', href: '/help' }, { label: 'We are hiring', href: '#' }, { label: 'Terms & Conditions', href: '/terms' },
  ]);
  const col2Links = parseLinks('col2Links', [
    { label: 'All', href: '/event' }, { label: 'Concerts', href: '/event' }, { label: 'Festivals', href: '/event' },
    { label: 'Conferences', href: '/event' }, { label: 'Shows', href: '/event' }, { label: 'Sports', href: '/event' },
  ]);
  const col3Links = parseLinks('col3Links', [
    { label: 'Event services', href: '/about' }, { label: 'Marketing services', href: '/about' },
    { label: 'Event staffing', href: '/about' }, { label: 'Ticket printing', href: '/about' },
    { label: 'Venue ticketing', href: '/about' }, { label: "Organisers' Guide", href: '/help' },
  ]);
  const col4Links = parseLinks('col4Links', [
    { label: 'My Profile', href: '/profile' }, { label: 'My Bookings', href: '/account' },
    { label: 'How to Buy Tickets', href: '/help' }, { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Help & Support', href: '/help' }, { label: 'Contact Us', href: '/help' },
  ]);

  // Copyright + Keep in Touch heading
  const copyright = footerNav.extra?.[`copyright${ls}`] || footerNav.extra?.copyright || '© 2026 Oshaia.com, Aventure Agency LTD. All rights reserved.';
  const keepInTouch = (language === 'fr' ? footerMain.title?.fr : footerMain.title?.en) || 'KEEP IN TOUCH';

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: footerSocial.extra?.facebook || '#' },
    { name: 'Instagram', icon: FaInstagram, url: footerSocial.extra?.instagram || '#' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: footerSocial.extra?.whatsapp || '#' },
    { name: 'TikTok', icon: FaTiktok, url: footerSocial.extra?.tiktok || '#' },
  ]

  const address = footerContact.extra?.address || 'Port Louis, Mauritius';
  const phone = footerContact.extra?.phone || '+230 5000 0000';
  const email = footerContact.extra?.email || 'contact@oshaia.com';
  return (
    <footer className="w-full bg-white">
      <PartnersSection />
      <NewsletterSection />
      <Platinumlist />

      {/* Dark columns section */}
      <div className="w-full bg-[#112b38] py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Column 1 */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">{col1Header}</h4>
            <ul className="space-y-2">
              {col1Links.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">{col2Header}</h4>
            <ul className="space-y-2">
              {col2Links.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">{col3Header}</h4>
            <ul className="space-y-2">
              {col3Links.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">{col4Header}</h4>
            <ul className="space-y-2">
              {col4Links.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Keep in Touch - white section */}
      <div className="w-full bg-white py-6 text-center border-b border-gray-100">
        <h4 className="text-sm sm:text-base font-bold uppercase mb-3 text-black tracking-widest">
          {keepInTouch}
        </h4>
        <ul className="flex items-center justify-center gap-5 list-none">
          {socialLinks.map((social) => (
            <li key={social.name}>
              <Link
                href={social.url}
                className="text-[#c89c6b] hover:text-[#112b38] transition-colors inline-block group"
                aria-label={social.name}
                target="_blank"
              >
                <social.icon className="w-5 h-5 text-[#c89c6b] group-hover:text-[#112b38] transition-colors" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info Bar */}
      <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-5 bg-[#112b38] text-white px-4 sm:px-8 md:px-16 lg:px-28 xl:px-44 justify-evenly">
        <div className="flex gap-2 sm:gap-3 items-center justify-center sm:justify-start">
          <FaLocationDot className="text-orange-500 flex-shrink-0 text-base sm:text-lg" />
          <Text className="text-xs sm:text-sm md:text-base">{address}</Text>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center justify-center sm:justify-start">
          <FaPhoneAlt className="text-orange-500 flex-shrink-0 text-base sm:text-lg" />
          <Text className="text-xs sm:text-sm md:text-base">{phone}</Text>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center justify-center sm:justify-start">
          <TfiEmail className="text-orange-500 flex-shrink-0 text-base sm:text-lg" />
          <Text className="text-xs sm:text-sm md:text-base">{email}</Text>
        </div>
      </div>

      {/* Copyright + Terms */}
      <div className="w-full bg-white py-4 text-center">
        <p className="text-gray-700 text-xs sm:text-sm mb-2">
          {copyright}
        </p>
        <ul className="flex items-center justify-center gap-2 sm:gap-3 list-none text-xs sm:text-sm">
          <li>
            <p className="text-gray-600 hover:text-[#c89c6b] transition-colors cursor-pointer" onClick={() => router.push('/terms')}>
              Terms &amp; condition
            </p>
          </li>
          <li className="text-gray-400">|</li>
          <li>
            <p className="text-gray-600 hover:text-[#c89c6b] transition-colors cursor-pointer" onClick={() => router.push('/help')}>
              Cookie terms
            </p>
          </li>
        </ul>
      </div>

    </footer>
  )
}

export default Footer