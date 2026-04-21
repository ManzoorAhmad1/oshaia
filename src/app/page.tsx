"use client"

import React from 'react'
import HeroCarousel from '@/components/home/HeroCarousel'
import BestOfSessassonSlider from '@/components/home/BestOfSessassonSlider'
import EventsSection from '@/components/home/EventsSection'
import Footer from '@/components/home/Footer'
import Top_seller from '@/components/home/top_seller'
import PartnersSection from '@/components/home/PartnersSection'
import Platinumlist from '@/components/home/platinumlist'
import { useCms } from '@/lib/useCms'

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
        {isVisible('topSeller') && <Top_seller />}
        {isVisible('partners') && <PartnersSection />}
        {isVisible('platinumlist') && <Platinumlist />}
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
