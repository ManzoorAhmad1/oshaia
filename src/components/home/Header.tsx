"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Search, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/AuthModal'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const router=useRouter()
  const navLinks = [
    { name: 'HOME', href: '/', active: true },
    { name: 'EVENTS', href: '/event', active: false },
    { name: 'ABOUT', href: '/about', active: false },
    { name: 'HELP CENTER', href: '/help', active: false },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm border-border-gray">
      <div className="section-container py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          {/* Logo */}
          <Link href="/" className="flex items-center mb-2 sm:mb-0">
            <Image 
              src="/images/white-01.png" 
              alt="Oshaia" 
              width={120} 
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${link.active ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon */}
            <button 
              className="p-2 hover:bg-[#c89c6b] rounded-lg transition-all duration-300 hover:scale-110"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            {/* Register Button */}
            <button 
              className="hidden sm:block bg-transparent border-2 border-[#112b38] text-[#112b38] rounded-full hover:bg-[#c89c6b] hover:text-[#112b38] hover:border-[#c89c6b] transition-all duration-300 text-xs sm:text-sm px-3 sm:px-5 py-1 sm:py-2"
              onClick={() => {
                setAuthMode('signup')
                setIsAuthModalOpen(true)
              }}
            >
              Register
            </button>

            {/* Login Button */}
            <button 
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] rounded-full hover:bg-[#112b38] hover:text-[#c89c6b] hover:border-[#112b38] transition-all duration-300 text-sm"
              onClick={() => {
                setAuthMode('login')
                setIsAuthModalOpen(true)
              }}
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-[#c89c6b] rounded-lg transition-all duration-300 hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border-gray">
            <nav className="flex flex-col space-y-2 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors text-sm ${
                    link.active ? 'text-accent-orange' : 'text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border-gray">
                <button 
                  className="w-full bg-transparent border-2 border-[#112b38] text-[#112b38] rounded-full hover:bg-[#c89c6b] hover:text-[#112b38] hover:border-[#c89c6b] transition-all duration-300 px-3 py-1.5 text-sm"
                  onClick={() => {
                    setAuthMode('signup')
                    setIsAuthModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Register
                </button>
                <button 
                  className="px-3 py-1.5 bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] rounded-full hover:bg-[#112b38] hover:text-[#c89c6b] hover:border-[#112b38] transition-all duration-300 text-sm"
                  onClick={() => {
                    setAuthMode('login')
                    setIsAuthModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Login
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  )
}

export default Header
