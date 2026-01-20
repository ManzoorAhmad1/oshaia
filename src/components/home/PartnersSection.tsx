"use client"

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
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

  return (
    <section 
      className="py-6 sm:py-12 lg:py-16 mt-16"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="section-container">
        <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-center text-accent-orange mb-6 sm:mb-10 uppercase tracking-wider">
          OUR PARTNERS
        </h2>

        <div className="relative px-4 sm:px-8 md:px-12">
          {/* Slider Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4 md:gap-6 lg:gap-8"
              animate={{ x: `-${(currentIndex * 100) / slidesToShow}%` }}
              transition={{ type: "tween", duration: 0.5 }}
            >
              {[...partners, ...partners.slice(0, slidesToShow)].map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / slidesToShow}% - ${(4 * (slidesToShow - 1)) / slidesToShow}rem)` }}
                >
                  <div className="flex items-center justify-center p-3 sm:p-4 md:p-6 bg-white border border-gray-200 rounded-xl hover:border-accent-orange hover:shadow-md transition-all duration-300 cursor-pointer h-full">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain opacity-100 hover:opacity-100 transition-opacity duration-300"
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-1/2 bg-white/90 hover:bg-white p-2 md:p-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            aria-label="Previous partners"
          >
            <svg className="w-[36.5px] h-[36.5px] text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-1/2 bg-white/90 hover:bg-white p-2 md:p-1 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            aria-label="Next partners"
          >
            <svg className="w-[36.5px] h-[36.5px] text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection