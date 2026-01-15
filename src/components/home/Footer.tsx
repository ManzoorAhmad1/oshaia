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
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Categories Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/concerts" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Concerts
                </Link>
              </li>
              <li>
                <Link href="/festivals" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Festivals
                </Link>
              </li>
              <li>
                <Link href="/sports" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/theater" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Theater
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase">For Organizers</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/event-management" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Event Management
                </Link>
              </li>
              <li>
                <Link href="/ticketing" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Ticketing Services
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/customer-service" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/venue-guidance" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Venue Guidance
                </Link>
              </li>
              <li>
                <Link href="/mobile-app" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Mobile App
                </Link>
              </li>
            </ul>
          </div>

          {/* Need Help Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase">Need Help?</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-gray hover:text-accent-orange transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-12 border-t border-gray-800">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-white font-bold text-xl mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Stay updated with the latest events and exclusive offers
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-orange"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4">
              <Image 
                src="/images/white-01.png" 
                alt="Oshaia" 
                width={120} 
                height={40}
                className="h-8 w-auto"
              />
              <p className="text-gray-400 text-sm">
                © 2026 Oshaia. All rights reserved.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="p-2 bg-white/5 hover:bg-accent-orange rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white/5 hover:bg-accent-orange rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white/5 hover:bg-accent-orange rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white/5 hover:bg-accent-orange rounded-full transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
