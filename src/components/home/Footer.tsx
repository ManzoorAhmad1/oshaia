"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Subscribe:', email)
    setEmail('')
  }

  return (
    <footer className="">
      {/* Main Footer Content */}
      <div className="section-container py-6 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {/* Categories Column */}
          <div>
            <h3 className="text-black font-bold text-base sm:text-lg mb-4 sm:mb-6 uppercase">Categories</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/concerts" className="text-blue-400 hover:text-accent-orange transition-colors text-xs sm:text-sm">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/sports" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/theater" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Theater
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers Column */}
          <div>
            <h3 className="text-black font-bold text-lg mb-6 uppercase">For Organizers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/event-management" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Event Management
                </Link>
              </li>
              <li>
                <Link href="/ticketing" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Ticketing Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-black font-bold text-lg mb-6 uppercase">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/customer-service" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/venue-guidance" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Venue Guidance
                </Link>
              </li>
              <li>
                <Link href="/mobile-app" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Mobile App
                </Link>
              </li>
            </ul>
          </div>

          {/* Need Help Column */}
          <div>
            <h3 className="text-black font-bold text-lg mb-6 uppercase">Need Help?</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-500 hover:text-accent-orange transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Social Media */}
        <div className="mt-12 pt-12 border-t border-gray-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Newsletter Section */}
            <div>
              <h3 className="text-black font-bold text-lg mb-4 uppercase">Stay Updated</h3>
              <p className="text-blue-500 mb-6 text-sm">
                Subscribe to our newsletter for the latest events and offers
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-black font-bold text-lg mb-4 uppercase">Connect With Us</h3>
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="p-2 bg-gray-100 hover:bg-accent-orange rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-black" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-100 hover:bg-accent-orange rounded-full transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-black" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-100 hover:bg-accent-orange rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-100 hover:bg-accent-orange rounded-full transition-colors"
                  aria-label="Youtube"
                >
                  <Youtube className="w-5 h-5 text-black" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-100 hover:bg-accent-orange rounded-full transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-8 pt-8 border-t border-gray-300 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-blue-500 text-sm">
              © {new Date().getFullYear()} Oshala. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="text-blue-500 hover:text-accent-orange transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-blue-500 hover:text-accent-orange transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-blue-500 hover:text-accent-orange transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer