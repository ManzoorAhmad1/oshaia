"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, CreditCard, Headphones, Ticket, Calendar, Users, Shield, Smartphone } from 'lucide-react'
import { FaLocationDot } from "react-icons/fa6";
import { Text } from 'rizzui/typography';
import { FaPhoneAlt } from 'react-icons/fa';
import { TfiEmail } from "react-icons/tfi";

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Top Section with 4 Columns */}
        <div className="pt-8 sm:pt-10 md:pt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 mb-8 sm:mb-10 md:mb-12">

          {/* Categories Column */}
          <div>
            <h3 className="text-black font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-5 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/concerts" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-xs sm:text-sm">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-xs sm:text-sm">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/clubbing" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-xs sm:text-sm">
                  Clubbing
                </Link>
              </li>
              <li>
                <Link href="/theatre" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-xs sm:text-sm">
                  Theatre
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organisers Column */}
          <div>
            <h3 className="text-black font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-5 uppercase tracking-wider">For Organisers</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/event-management" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Event Management
                </Link>
              </li>
              <li>
                <Link href="/ticketing-services" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Ticketing Services
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/add-event" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Add Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-black font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-5 uppercase tracking-wider">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/customer-support" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/venue-ticketing" className="text-blue-500 hover:text-[#c89c6b] transition-colors text-sm">
                  Venue Ticketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Need Help Column */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <h3 className="text-black font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-5 uppercase tracking-wider">Need Help?</h3>

            {/* Chat Online Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-blue-500 text-xs sm:text-sm font-medium">Chat with us:</div>
              <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#c89c6b] text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>Chat Online</span>
              </button>
            </div>

            {/* We Accept Section */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-blue-500 text-sm sm:text-base font-medium">We accept</div>
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                <div className="flex items-center justify-center transition-colors">
                  <img
                  src='/images/1) - Juice MCB LOGO.png'
                  alt="Juice MCB"
                  className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                  src='/images/2) - emtel-blink-logo-500px.png'
                  alt="Emtel Blink"
                  className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center  transition-colors">
                  <img
                  src='/images/3) - Visa-Logo-2014.png'
                  alt="Visa"
                  className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                  src='/images/4) - Mastercard-logo.png'
                  alt="Mastercard"
                  className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                  src='/images/5) - maucas-logo-1024x263.png'
                  alt="Maucas"
                  className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                  src='/images/6) - My.t Money .png'
                  alt="My.t Money"
                  className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-10 lg:py-14 mt-4 bg-[#f5f5f8] px-4 sm:px-8 md:px-16 lg:px-28 xl:px-44'>
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
        <div className="py-3 sm:py-4 border-t border-gray-300 text-center bg-black text-white w-full">
          <div className="text-gray-400 text-[10px] sm:text-xs md:text-sm px-4">
            © {new Date().getFullYear()} Platinumlist. All rights reserved.
            <span className="hidden sm:inline"> | </span>
            <span className="block sm:inline mt-1 sm:mt-0">
              <Link href="/terms" className="hover:text-[#c89c6b] transition-colors">Terms & Conditions</Link>
              <span className="mx-1 sm:mx-2">|</span>
              <Link href="/privacy" className="hover:text-[#c89c6b] transition-colors">Privacy Policy</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer