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
    <section className=" py-12 lg:py-16">
      <div className="section-container">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-accent-orange mb-10 uppercase tracking-wider">
          OUR PARTNERS
        </h2>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-accent-orange hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative w-24 h-24 grayscale hover:grayscale-0 transition-all">
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
