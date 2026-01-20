"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, CreditCard, Headphones, Ticket, Calendar, Users, Shield, Smartphone } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        {/* Top Section with 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
          
          {/* Categories Column */}
          <div>
            <h3 className="text-black font-bold text-base sm:text-lg mb-4 sm:mb-5 md:mb-6 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link href="/concerts" className="text-blue-500 hover:text-orange-500 transition-colors text-xs sm:text-sm">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-blue-500 hover:text-orange-500 transition-colors text-xs sm:text-sm">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/clubbing" className="text-blue-500 hover:text-orange-500 transition-colors text-xs sm:text-sm">
                  Clubbing
                </Link>
              </li>
              <li>
                <Link href="/theatre" className="text-blue-500 hover:text-orange-500 transition-colors text-xs sm:text-sm">
                  Theatre
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organisers Column */}
          <div>
            <h3 className="text-black font-bold text-lg mb-6 uppercase tracking-wider">For Organisers</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/event-management" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Event Management
                </Link>
              </li>
              <li>
                <Link href="/ticketing-services" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Ticketing Services
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/add-event" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Add Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-black font-bold text-lg mb-6 uppercase tracking-wider">Services</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/customer-support" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/venue-ticketing" className="text-blue-500 hover:text-orange-500 transition-colors text-sm">
                  Venue Ticketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Need Help Column */}
          <div className="space-y-6">
            <h3 className="text-black font-bold text-lg mb-6 uppercase tracking-wider">Need Help?</h3>
            
            {/* Chat Online Section */}
            <div className="space-y-4">
              <div className="text-blue-500 text-sm font-medium">Chat with us:</div>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Chat Online</span>
              </button>
            </div>

            {/* We Accept Section */}
            <div className="space-y-3">
              <div className="text-blue-500 text-sm font-medium">We accept</div>
              <div className="flex gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-700" />
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-700" />
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Features */}
        <div className="py-6 sm:py-7 md:py-8 border-y border-gray-300 mb-6 sm:mb-7 md:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm">Official Tickets</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Guaranteed authenticity</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm">Easy Booking</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Quick & simple process</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm">24/7 Support</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Always here to help</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-xs sm:text-sm">Secure Payments</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Safe transactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-5 md:gap-6">
          {/* Brand Logo and Description */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="bg-black text-white px-2 sm:px-3 py-1 rounded-lg font-bold text-base sm:text-lg">
                Platinumlist
              </div>
              <span className="text-gray-600 text-xs sm:text-sm">Entertainment discovery and monetisation platform.</span>
            </div>
            
            {/* Mobile App Download */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <div className="font-semibold text-xs sm:text-sm">Download Our App</div>
                <div className="text-[10px] sm:text-xs text-gray-500">Available on iOS & Android</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium">Contact Support:</span>
            </div>
            <div className="text-blue-500 text-xs sm:text-sm">support@platinumlist.net</div>
            <div className="text-gray-500 text-xs sm:text-sm">+971 4 123 4567</div>
          </div>

          {/* Social Media */}
          <div className="space-y-2 sm:space-y-3">
            <div className="text-xs sm:text-sm font-medium">Follow Us</div>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="p-1.5 sm:p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-blue-100 transition-colors">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-pink-100 transition-colors">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-7 md:mt-8 pt-4 sm:pt-5 md:pt-6 border-t border-gray-300 text-center">
          <div className="text-gray-500 text-[10px] sm:text-xs md:text-sm">
            © {new Date().getFullYear()} Platinumlist. All rights reserved. | 
            <Link href="/terms" className="ml-1 sm:ml-2 hover:text-orange-500 transition-colors">Terms & Conditions</Link> | 
            <Link href="/privacy" className="ml-1 sm:ml-2 hover:text-orange-500 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer