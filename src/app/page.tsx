"use client"

import React from 'react'
import HeroCarousel from '@/components/home/HeroCarousel'
import EventsSection from '@/components/home/EventsSection'
import PartnersSection from '@/components/home/PartnersSection'
import Footer from '@/components/home/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <main>
        <HeroCarousel />
        <EventsSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
