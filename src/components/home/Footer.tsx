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

const Footer = () => {

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: '#' },
    { name: 'Instagram', icon: FaInstagram, url: '#' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: '#' },
    { name: 'TikTok', icon: FaTiktok, url: '#' },
  ]
 const router=useRouter()
  return (
    <footer className="w-full bg-white">
      <PartnersSection />
      <NewsletterSection />
      <Platinumlist />

      {/* Dark columns section */}
      <div className="w-full bg-[#112b38] py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* About Us */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">About us</h4>
            <ul className="space-y-2">
              {[
                { label: 'Who We Are ?', href: '/about' },
                { label: 'Home', href: '/' },
                { label: 'Events', href: '/event' },
                { label: 'Help Center', href: '/help' },
                { label: 'We are hiring', href: '#' },
                { label: 'Latest News', href: '#' },
                { label: 'Terms & Conditions', href: '/terms' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">Categories</h4>
            <ul className="space-y-2">
              {[
                { label: 'All', href: '/event' },
                { label: 'Concerts', href: '/event' },
                { label: 'Festivals', href: '/event' },
                { label: 'Conferences', href: '/event' },
                { label: 'Shows', href: '/event' },
                { label: 'Sports', href: '/event' },
                { label: 'Top Seller', href: '/event' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">Services</h4>
            <ul className="space-y-2">
              {[
                { label: 'Event services', href: '/about' },
                { label: 'Marketing services', href: '/about' },
                { label: 'Event staffing', href: '/about' },
                { label: 'Ticket printing', href: '/about' },
                { label: 'Venue ticketing', href: '/about' },
                { label: 'System features', href: '/about' },
                { label: "Organisers' Guide", href: '/help' },
                { label: 'Advertise with us', href: '/about' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white text-xs sm:text-sm hover:text-[#c89c6b] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="text-[#c89c6b] font-bold text-sm sm:text-base mb-4 uppercase">Customer</h4>
            <ul className="space-y-2">
              {[
                { label: 'My Profile', href: '/profile' },
                { label: 'My Bookings', href: '/account' },
                { label: 'Chat with Us on WhatsApp', href: '#' },
                { label: 'How to Buy Tickets', href: '/help' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Help & Support', href: '/help' },
                { label: 'Contact Us', href: '/help' },
              ].map(item => (
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
          KEEP IN TOUCH
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
          <Text className="text-xs sm:text-sm md:text-base">Maxuel street, Frankfurt 2589 Germany</Text>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center justify-center sm:justify-start">
          <FaPhoneAlt className="text-orange-500 flex-shrink-0 text-base sm:text-lg" />
          <Text className="text-xs sm:text-sm md:text-base">(022) 666 888 0000</Text>
        </div>
        <div className="flex gap-2 sm:gap-3 items-center justify-center sm:justify-start">
          <TfiEmail className="text-orange-500 flex-shrink-0 text-base sm:text-lg" />
          <Text className="text-xs sm:text-sm md:text-base">needhelp@gmail.com</Text>
        </div>
      </div>

      {/* Copyright + Terms */}
      <div className="w-full bg-white py-4 text-center">
        <p className="text-gray-700 text-xs sm:text-sm mb-2">
          Copyright © 2026 Oshaia.com, Aventure Agency LTD. All rights reserved.
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