"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, CreditCard, Headphones, Ticket, Calendar, Users, Shield, Smartphone } from 'lucide-react'
import { FaLocationDot } from "react-icons/fa6";
import { Text } from 'rizzui/typography';
import { FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import { TfiEmail } from "react-icons/tfi";
import { useLanguage } from '@/context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: '#' },
    { name: 'Twitter', icon: FaTwitter, url: '#' },
    { name: 'Instagram', icon: FaInstagram, url: '#' },
    { name: 'Pinterest', icon: FaPinterest, url: '#' },
    { name: 'YouTube', icon: FaYoutube, url: '#' },
  ]

  return (
    <footer className="w-full bg-white">
      <div className='w-full'>
        {/* Contact Info Bar */}
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-6 lg:py-8 bg-[#f5f5f8] px-4 sm:px-8 md:px-16 lg:px-28 xl:px-44'>
          <div className='flex gap-2 sm:gap-3 items-center justify-center sm:justify-start'>
            <FaLocationDot className='text-orange-500 flex-shrink-0 text-base sm:text-lg' />
            <Text className='text-xs sm:text-sm md:text-base'>Maxuel street, Frankfurt 2589 Germany</Text>
          </div>
          <div className='flex gap-2 sm:gap-3 items-center justify-center sm:justify-start'>
            <FaPhoneAlt className='text-orange-500 flex-shrink-0 text-base sm:text-lg' />
            <Text className='text-xs sm:text-sm md:text-base'>(022) 666 888 0000</Text>
          </div>
          <div className='flex gap-2 sm:gap-3 items-center justify-center sm:justify-start'>
            <TfiEmail className='text-orange-500 flex-shrink-0 text-base sm:text-lg' />
            <Text className='text-xs sm:text-sm md:text-base'>needhelp@gmail.com</Text>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="w-full bg-white py-4 sm:py-5 md:py-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">OUR PAYMENT METHODS</div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4">
              <div className="flex gap-1 sm:gap-2 items-center">
                <img
                  src='/images/1) - Juice MCB LOGO.png'
                  alt="Juice MCB"
                  className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain"
                />
                <img
                  src='/images/2) - emtel-blink-logo-500px.png'
                  alt="Emtel Blink"
                  className="h-4 sm:h-5 md:h-6 lg:h-8 w-auto object-contain"
                />
                <img
                  src='/images/3) - Visa-Logo-2014.png'
                  alt="Visa"
                  className="h-4 sm:h-5 md:h-6 lg:h-8 w-auto object-contain"
                />
                <img
                  src='/images/4) - Mastercard-logo.png'
                  alt="Mastercard"
                  className="h-4 sm:h-5 md:h-6 lg:h-8 w-auto object-contain"
                />
                <img
                  src='/images/5) - maucas-logo-1024x263.png'
                  alt="Maucas"
                  className="h-5 sm:h-6 md:h-7 lg:h-9 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keep in Touch Section */}
        <div className="w-full bg-white py-4 sm:py-5 md:py-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">KEEP IN TOUCH</div>
            <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 px-4">
              {socialLinks.map((social) => (
                <Link 
                  key={social.name} 
                  href={social.url}
                  className="text-black hover:text-[#c89c6b] transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-4 sm:py-5 md:py-6 bg-white border-t border-gray-200">
          <div className="text-center px-4">
            <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
              <span className="font-semibold">Copyright © {new Date().getFullYear()} Ticketbox.mu, TICKETBOX MAURITIUS LTD.</span> All rights reserved. BRN: C1816081 | OTO: 14910.
            </p>
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 text-gray-600 text-xs sm:text-sm">
              <Link href="/terms" className="hover:text-[#c89c6b] transition-colors">
                Terms & condition
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/cookie-terms" className="hover:text-[#c89c6b] transition-colors">
                Cookie terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer