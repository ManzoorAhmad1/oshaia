"use client"

import React, { useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'

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

function getCurrentSpv(): number {
  if (typeof window === 'undefined') return 7
  const w = window.innerWidth
  if (w >= 1536) return 7
  if (w >= 1280) return 6
  if (w >= 1024) return 5
  if (w >= 768)  return 4
  if (w >= 640)  return 3
  return 2
}

const PartnersSection = () => {
  // realIndex of the card that should appear in the visual center
  const [centerRealIndex, setCenterRealIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  // When Swiper slides, the leftmost visible real slide is realIndex.
  // Center = realIndex + floor(slidesPerView / 2)
  const updateCenter = useCallback((swiper: SwiperType) => {
    const spv = getCurrentSpv()
    const offset = Math.floor(spv / 2)
    const center = (swiper.realIndex + offset) % partners.length
    setCenterRealIndex(center)
  }, [])

  return (
    <section className="py-6 sm:py-8 md:py-10 mt-6 sm:mt-8 md:mt-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-accent-orange mb-3 sm:mb-4 md:mb-5 lg:mb-6 uppercase tracking-wider">
          OUR PARTNERS
        </h2>

        <div className="relative px-10 sm:px-12">
          <div style={{ clipPath: 'inset(-20px 0px)' }}>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: '.partners-prev',
              nextEl: '.partners-next',
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            slidesPerGroup={1}
            slidesPerView={7}
            spaceBetween={20}
            breakpoints={{
              0:    { slidesPerView: 2, spaceBetween: 12 },
              640:  { slidesPerView: 3, spaceBetween: 14 },
              768:  { slidesPerView: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 16 },
              1280: { slidesPerView: 6, spaceBetween: 18 },
              1536: { slidesPerView: 7, spaceBetween: 20 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              updateCenter(swiper)
            }}
            onSlideChange={(swiper) => updateCenter(swiper)}
            onBreakpoint={(swiper) => updateCenter(swiper)}
            className="py-6"
            style={{ overflow: 'visible' }}
          >
            {partners.map((partner, i) => {
              const isCenter = i === centerRealIndex
              return (
                <SwiperSlide key={partner.id}>
                  <Link href={`/event/${partner.id}`} className="block h-full w-full">
                    <div
                      className="flex items-center justify-center p-3 sm:p-4 md:p-5 bg-white rounded-xl h-full w-full transition-all duration-300"
                      style={{
                        border: isCenter ? 'none' : '1px solid #1a1a1a',
                        outline: isCenter ? '2px solid #c89c6b' : 'none',
                        outlineOffset: '0px',
                        transform: isCenter ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: isCenter ? '0 4px 18px rgba(200,156,107,0.18)' : 'none',
                      }}
                    >
                      <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain"
                          sizes="96px"
                        />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
          </div>

          {/* Custom navigation arrows */}
          <button
            className="partners-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-[#112b38] hover:text-[#c89c6b] transition-colors"
            aria-label="Previous"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="partners-next absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-[#112b38] hover:text-[#c89c6b] transition-colors"
            aria-label="Next"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default PartnersSection