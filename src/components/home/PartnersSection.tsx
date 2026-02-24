"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const PartnersSection = () => {
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

  const getVisiblePartners = () => {
    const visible = []
    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % partners.length
      visible.push(partners[index])
    }
    return visible
  }

  const isCenterItem = (index: number) => {
    const centerIndex = Math.floor(slidesToShow / 2)
    return index === centerIndex
  }

  return (
    <section 
      className="py-6 sm:py-8 md:py-10 mt-6 sm:mt-8 md:mt-10"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-accent-orange mb-3 sm:mb-4 md:mb-5 lg:mb-6 uppercase tracking-wider">
          OUR PARTNERS
        </h2>

        <div className="relative px-2 sm:px-4 md:px-8 lg:px-12">
          {/* Slider Container */}
          <div className="overflow-x-hidden overflow-y-visible py-4">
            <motion.div
              className="flex gap-4 md:gap-6 lg:gap-8"
              animate={{ x: `-${(currentIndex * 100) / slidesToShow}%` }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              {[...partners, ...partners.slice(0, slidesToShow)].map((partner, index) => {
                const displayIndex = index % partners.length
                const positionIndex = index - currentIndex
                const isCenter = positionIndex >= 0 && positionIndex < slidesToShow && isCenterItem(positionIndex)
                
                return (
                  <div
                    key={`${partner.id}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: `calc(${100 / slidesToShow}% - ${(4 * (slidesToShow - 1)) / slidesToShow}rem)` }}
                  >
                    <Link href={`/event/${partner.id}`} className="block h-full">
                      <div className={`flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 bg-white rounded-lg sm:rounded-xl cursor-pointer h-full ${isCenter ? 'scale-110 border-2 border-accent-orange shadow-xl' : 'border border-black'}`}>
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white/90 p-1 sm:p-1.5 md:p-2 rounded-full shadow-lg z-10"
            aria-label="Previous partners"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white/90 p-1 sm:p-1.5 md:p-2 rounded-full shadow-lg z-10"
            aria-label="Next partners"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection