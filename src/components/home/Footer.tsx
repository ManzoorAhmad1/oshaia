"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle, CreditCard, Headphones, Ticket, Calendar, Users, Shield, Smartphone } from 'lucide-react'
import { FaLocationDot } from "react-icons/fa6";
import { Text } from 'rizzui/typography';
import { FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import { TfiEmail } from "react-icons/tfi";
import { useLanguage } from '@/context/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')

  const partners = [
    { id: 1, name: 'Partner 1', logo: '/images/image-1768921181363.png' },
    { id: 2, name: 'Partner 2', logo: '/images/image-1768921181363.png' },
    { id: 3, name: 'Partner 3', logo: '/images/image-1768921181363.png' },
    { id: 4, name: 'Partner 4', logo: '/images/image-1768921181363.png' },
    { id: 5, name: 'Partner 5', logo: '/images/image-1768921181363.png' },
    { id: 6, name: 'Partner 6', logo: '/images/image-1768921181363.png' },
    { id: 7, name: 'Partner 7', logo: '/images/image-1768921181363.png' },
    { id: 8, name: 'Partner 8', logo: '/images/image-1768921181363.png' },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slidesToShow, setSlidesToShow] = useState(6)

  // Responsive slides calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1280) setSlidesToShow(6)
      else if (width >= 1024) setSlidesToShow(5)
      else if (width >= 768) setSlidesToShow(4)
      else if (width >= 640) setSlidesToShow(3)
      else setSlidesToShow(2)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + slidesToShow >= partners.length ? 0 : prev + 1
    )
  }, [slidesToShow, partners.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, partners.length - slidesToShow) : prev - 1
    )
  }, [slidesToShow, partners.length])

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


        {/* Payment Methods Section */}
        <div className="w-full bg-white py-2 sm:py-3 md:py-4">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3">OUR PAYMENT METHODS</div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 px-4">
              <div className="flex gap-1 sm:gap-2 items-center">
                <img
                  src='/images/1) - Juice MCB LOGO.png'
                  alt="Juice MCB"
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                />
                <img
                  src='/images/2) - emtel-blink-logo-500px.png'
                  alt="Emtel Blink"
                  className="h-4 sm:h-5 md:h-6 w-auto object-contain"
                />
                <img
                  src='/images/3) - Visa-Logo-2014.png'
                  alt="Visa"
                  className="h-4 sm:h-5 md:h-6 w-auto object-contain"
                />
                <img
                  src='/images/4) - Mastercard-logo.png'
                  alt="Mastercard"
                  className="h-4 sm:h-5 md:h-6 w-auto object-contain"
                />
                <img
                  src='/images/5) - maucas-logo-1024x263.png'
                  alt="Maucas"
                  className="h-4 sm:h-5 md:h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Keep in Touch Section */}
        <div className="w-full bg-white py-2 sm:py-3 md:py-4 border-gray-200">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3">KEEP IN TOUCH</div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 px-4">
              {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            className="text-black hover:text-[#c89c6b] transition-colors"
            aria-label={social.name}
          >
            <social.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </Link>
              ))}
            </div>
          </div>
        </div>



        {/* Copyright Section */}
        <div className="py-2 sm:py-3 md:py-4 bg-white border-gray-200">
          <div className="text-center px-4">
            <p className="text-gray-700 text-xs sm:text-sm mb-2">
              <span className="font-semibold">Copyright © {new Date().getFullYear()} Ticketbox.mu, TICKETBOX MAURITIUS LTD.</span> All rights reserved. BRN: C1816081 | OTO: 14910.
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-gray-600 text-xs">
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
      </div>
    </footer>
  )
}

export default Footer