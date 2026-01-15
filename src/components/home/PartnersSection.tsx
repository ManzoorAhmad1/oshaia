"use client"

import React from 'react'
import Image from 'next/image'

const PartnersSection = () => {
  // Using placeholder logos - you can replace with actual partner logos
  const partners = [
    { id: 1, name: 'Partner 1', logo: '/images/image-1768495487610.png' },
    { id: 2, name: 'Partner 2', logo: '/images/image-1768495487610.png' },
    { id: 3, name: 'Partner 3', logo: '/images/image-1768495487610.png' },
    { id: 4, name: 'Partner 4', logo: '/images/image-1768495487610.png' },
    { id: 5, name: 'Partner 5', logo: '/images/image-1768495487610.png' },
    { id: 6, name: 'Partner 6', logo: '/images/image-1768495487610.png' },
  ]

  return (
    <section className="py-6 sm:py-12 lg:py-16">
      <div className="section-container">
        {/* Section Title */}
        <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-center text-accent-orange mb-6 sm:mb-10 uppercase tracking-wider">
          OUR PARTNERS
        </h2>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-3 sm:p-6 bg-white border border-gray-200 rounded-xl hover:border-accent-orange hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 grayscale hover:grayscale-0 transition-all">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PartnersSection
