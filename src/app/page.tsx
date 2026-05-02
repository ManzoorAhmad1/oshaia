"use client"

import React from 'react'
import HeroCarousel from '@/components/home/HeroCarousel'
import BestOfSessassonSlider from '@/components/home/BestOfSessassonSlider'
import EventsSection from '@/components/home/EventsSection'
import Footer from '@/components/home/Footer'
import Top_seller from '@/components/home/top_seller'
import { useCms } from '@/lib/useCms'
import AdBanner from '@/components/AdBanner'

const HomePage = () => {
  const { content: homeCms } = useCms('home');
  const isVisible = (key: string) => {
    const vis = homeCms[key]?.isVisible;
    return vis === undefined || vis === null || Boolean(vis);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <main className="w-full">
        {isVisible('hero') && <HeroCarousel />}
        {isVisible('bestOfSeason') && <BestOfSessassonSlider />}
        {isVisible('events') && <EventsSection />}
        <AdBanner position="home" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" />
        {isVisible('topSeller') && <Top_seller />}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
