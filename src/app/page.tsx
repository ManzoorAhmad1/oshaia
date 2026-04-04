"use client"

import React from 'react'
import HeroCarousel from '@/components/home/HeroCarousel'
import BestOfSessassonSlider from '@/components/home/BestOfSessassonSlider'
import EventsSection from '@/components/home/EventsSection'
import Footer from '@/components/home/Footer'
import Top_seller from '@/components/home/top_seller'

const HomePage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="w-full">
        <HeroCarousel />
        <BestOfSessassonSlider />
        <EventsSection />
        <Top_seller/>
        
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
