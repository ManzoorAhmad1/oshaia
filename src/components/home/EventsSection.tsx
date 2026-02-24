"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const EventsSection = () => {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')

  // Category keys mapping to translations
  const categoryKeys = ['all', 'concert', 'festival', 'conferences', 'show', 'sport'] as const
  
  const getCategoryLabel = (key: string) => {
    const labels: Record<string, string> = {
      all: t.all,
      concert: t.concert,
      festival: t.festival,
      conferences: t.conferences,
      show: t.show,
      sport: t.sport,
    }
    return labels[key] || key
  }

  const events = [
    {
      id: 1,
      image: '/images/BANNER - SAMPLE/fire-horse-grid-1 1090x1080.jpg',
      title: 'Night Concert Live',
      category: 'CONCERT',
      day: '25',
      month: 'Jan',
      year: '2026',
      location: 'Dubai Arena',
      price: 'AED 299',
      badge: 'TRENDING',
      badgeColor: 'bg-accent-orange'
    },
    {
      id: 2,
      image: '/images/BANNER - SAMPLE/Home Page Carousel.jpg',
      title: 'The First Ever',
      category: 'FESTIVAL',
      day: '15',
      month: 'Feb',
      year: '2026',
      location: 'Festival City',
      price: 'AED 199',
      badge: 'HOT',
      badgeColor: 'bg-accent-pink'
    },
    {
      id: 3,
      image: '/images/BANNER - SAMPLE/Video For Carousel and Main Event(Where Choose Tickets Or Seats)1.jpg',
      title: 'Antalay Championship',
      category: 'SPORT',
      day: '10',
      month: 'Mar',
      year: '2026',
      location: 'Sports Complex',
      price: 'AED 399',
      badge: 'NEW',
      badgeColor: 'bg-secondary-purple'
    },
    {
      id: 4,
      image: '/images/BANNER - SAMPLE/Video For Carousel and Main Event(Where Choose Tickets Or Seats)2.jpg',
      title: 'Summer Music Fest',
      category: 'CONCERT',
      day: '20',
      month: 'Apr',
      year: '2026',
      location: 'Beach Arena',
      price: 'AED 249',
      badge: '',
      badgeColor: ''
    },
    {
      id: 5,
      image: '/images/BANNER - SAMPLE/fire-horse-grid-1 1090x1080.jpg',
      title: 'Tech Conference 2026',
      category: 'CONFERENCES',
      day: '05',
      month: 'May',
      year: '2026',
      location: 'Convention Center',
      price: 'AED 499',
      badge: 'NEW',
      badgeColor: 'bg-secondary-purple'
    },
    {
      id: 6,
      image: '/images/BANNER - SAMPLE/Home Page Carousel.jpg',
      title: 'Comedy Night Show',
      category: 'SHOW',
      day: '18',
      month: 'May',
      year: '2026',
      location: 'Theater Hall',
      price: 'AED 149',
      badge: '',
      badgeColor: ''
    }
  ]

  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(event => event.category.toLowerCase() === activeCategory)

  return (
    <section className="mt-6 sm:mt-8 md:mt-10 pb-6 sm:pb-8 md:pb-10">
      {/* Section Title - 85% centered */}
      <div className="w-full sm:w-[85%] mx-auto">
        <h2 className="section-title text-black my-4 mb-8">{t.allEvent}</h2>
      </div>

      {/* Category Tabs - full width */}
      <div className="w-full overflow-x-auto mb-6 sm:mb-8 border-gray-200 bg-[#112b38] py-2">
          <div className="flex justify-start sm:justify-center items-center gap-0 min-w-max sm:min-w-0">
            {categoryKeys.map((category, idx) => (
              <React.Fragment key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider cursor-pointer relative whitespace-nowrap
                        ${activeCategory === category
                      ? 'text-[#c89c6b]'
                      : 'text-white'}
                      `}
                >
                  {getCategoryLabel(category)}
                </button>
                {idx < categoryKeys.length - 1 && (
                  <span className="h-6 sm:h-8 w-[2px] bg-[#c89c6b] mx-1 sm:mx-2 inline-block opacity-40"></span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      {/* Cards + Button - 85% centered */}
      <div className="w-full sm:w-[85%] mx-auto">
        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-8 overflow-visible justify-items-center px-4">
          {filteredEvents.map((event,index) => (
            <Link key={event.id} href={`/event/${event.id}`} className="mb-12 w-full max-w-[380px] h-auto event-card relative overflow-visible block cursor-pointer">

              {/* Badge Image at Top Left - Outside the card */}
              <div className="absolute -top-[22px] -left-[30px] w-[150px] h-auto z-30">
                <img
                  src={`/images/LOGO TAG/${index + 1}.png`}
                  alt="Badge"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Main Content */}
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-xl bg-white">
                {/* Event Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={event.id <= 3}
                  />
                  
                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-white rounded-2xl shadow-lg overflow-hidden z-20 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="text-lg sm:text-xl font-bold text-[#112b38] leading-none">{event.day}</div>
                      <div className="text-sm sm:text-base font-bold text-[#112b38] uppercase">{event.month}</div>
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="w-full bg-white flex items-center justify-between border border-t-0 rounded-bl-2xl rounded-br-lg">
                  <div className='flex flex-col pl-3 sm:pl-4 '>
                    <p className="text-xs sm:text-sm font-bold whitespace-nowrap">{event.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600">{event.location}</p>
                  </div>
                  <div className='w-[200px] flex flex-col gap-2 items-center py-2 sm:py-3 px-4 sm:px-6 bg-[#112b38] text-white rounded-bl-3xl'>
                    <p className="mr-1 sm:mr-2 text-[8px] sm:text-[9.9px]">{t.asFrom}</p>
                    <p className="text-xs sm:text-[15.9px]">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* View All Button */}
        <div className="w-full flex items-center justify-center mt-2 sm:mt-3 md:mt-4">
          <button className="w-[200px] h-[35px] sm:h-[40px] md:h-[45px] bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base md:text-lg uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap flex items-center justify-center">
            {t.viewAllEvent}
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
