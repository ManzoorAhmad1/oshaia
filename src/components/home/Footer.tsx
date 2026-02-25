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

const Footer = () => {

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, url: '#' },
    { name: 'Instagram', icon: FaInstagram, url: '#' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: '#' },
    { name: 'TikTok', icon: FaTiktok, url: '#' },
  ]

  return (
    <footer className="w-full bg-white">
      <PartnersSection />
              <NewsletterSection />
              <Platinumlist />
      <div className='w-full text-center '>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Payment Methods Section */}
            <div className="my-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-3 sm:mb-4 md:mb-5 text-black">
                OUR PAYMENT METHODS
              </h4>
              <div className="flex justify-center">
                <img
                  src='/Red Simple Typographic 2026 Christmas Supplies Logo.png'
                  alt="Payment Methods"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
              </div>
            </div>

            {/* Keep in Touch Section */}
            <div className="">
              <h4 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-4 sm:mb-4 md:mb-4 text-black">
                KEEP IN TOUCH
              </h4>
              <ul className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 list-none mb-4 sm:mb-5 md:mb-6">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <Link
                      href={social.url}
                      className="text-black hover:text-[#c89c6b] transition-colors inline-block"
                      aria-label={social.name}
                      target="_blank"
                    >
                      <social.icon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-4 md:h-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Copyright Section */}
            <div className="">
              <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-0">
                Copyright © {new Date().getFullYear()} Ticketbox.mu,{' '}
                <strong>TICKETBOX MAURITIUS LTD.</strong> All rights reserved.
              </p>
            </div>

            {/* Terms Links */}
            <div className="mt-3 sm:mt-4 md:mt-5">
              <ul className="flex items-center justify-center gap-2 sm:gap-3 list-none text-xs sm:text-sm">
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#c89c6b] transition-colors">
                    Terms &amp; condition
                  </Link>
                </li>
                <li className="text-gray-400">|</li>
                <li>
                  <Link href="/cookie-terms" className="text-gray-600 hover:text-[#c89c6b] transition-colors">
                    Cookie terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Contact Info Bar */}
        <div className='mt-4 w-full flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-6 lg:py-8 bg-[#112b38]  text-white px-4 sm:px-8 md:px-16 lg:px-28 xl:px-44 justify-evenly'>
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