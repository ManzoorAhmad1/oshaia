"use client"

import React from 'react'
import HeroCarousel from '@/components/home/HeroCarousel'
import EventsSection from '@/components/home/EventsSection'
import PartnersSection from '@/components/home/PartnersSection'
import Footer from '@/components/home/Footer'
import BestOfSessassonSlider from '@/components/home/BestOfSessassonSlider'
import Platinumlist from '@/components/home/platinumlist'
import Top_seller from '@/components/home/top_seller'
import NewsletterSection from '@/components/home/NewsletterSection'

const HomePage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="w-full">
        <HeroCarousel />
        <BestOfSessassonSlider />
        <EventsSection />
        <Top_seller/>
        <PartnersSection />
        <NewsletterSection />
        <Platinumlist />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
