"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Clock } from 'lucide-react'

const EventsSection = () => {
  const [activeCategory, setActiveCategory] = useState('ALL')

  const categories = ['ALL', 'CONCERT', 'FESTIVAL', 'CONFERENCES', 'SHOW', 'SPORT']

  const events = [
    {
      id: 1,
      image: '/images/1762553038_1080.jpg',
      title: 'Night Concert Live',
      category: 'CONCERT',
      date: '25 JAN 2026',
      time: '8:00 PM',
      location: 'Dubai Arena',
      price: 'AED 299',
      badge: 'TRENDING',
      badgeColor: 'bg-accent-orange'
    },
    {
      id: 2,
      image: '/images/eventposter.jpg',
      title: 'The First Ever',
      category: 'FESTIVAL',
      date: '15 FEB 2026',
      time: '6:00 PM',
      location: 'Festival City',
      price: 'AED 199',
      badge: 'HOT',
      badgeColor: 'bg-accent-pink'
    },
    {
      id: 3,
      image: '/images/1762553038_BIGG SEAT.jpg',
      title: 'Antalay Championship',
      category: 'SPORT',
      date: '10 MAR 2026',
      time: '7:00 PM',
      location: 'Sports Complex',
      price: 'AED 399',
      badge: 'NEW',
      badgeColor: 'bg-secondary-purple'
    },
    {
      id: 4,
      image: '/images/1762553038_1080.jpg',
      title: 'Summer Music Fest',
      category: 'CONCERT',
      date: '20 APR 2026',
      time: '9:00 PM',
      location: 'Beach Arena',
      price: 'AED 249',
      badge: '',
      badgeColor: ''
    },
    {
      id: 5,
      image: '/images/eventposter.jpg',
      title: 'Tech Conference 2026',
      category: 'CONFERENCES',
      date: '05 MAY 2026',
      time: '10:00 AM',
      location: 'Convention Center',
      price: 'AED 499',
      badge: 'NEW',
      badgeColor: 'bg-secondary-purple'
    },
    {
      id: 6,
      image: '/images/1762553038_BIGG SEAT.jpg',
      title: 'Comedy Night Show',
      category: 'SHOW',
      date: '18 MAY 2026',
      time: '8:30 PM',
      location: 'Theater Hall',
      price: 'AED 149',
      badge: '',
      badgeColor: ''
    }
  ]

  const filteredEvents = activeCategory === 'ALL'
    ? events
    : events.filter(event => event.category === activeCategory)

  return (
    <section className="mt-16">
      <div className="">
        {/* Section Title */}
        <h2 className="section-title text-black">ALL EVENT</h2>

        {/* Category Tabs */}
        <div className="w-full overflow-x-auto mb-8 sm:mb-12 border-b border-gray-200 bg-[#07114A]">
          <div className="flex justify-start sm:justify-center items-center gap-0 min-w-max sm:min-w-0">
            {categories.map((category, idx) => (
              <React.Fragment key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-base md:text-lg font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer relative whitespace-nowrap
                        ${activeCategory === category
                      ? 'text-accent-orange'
                      : 'text-white hover:text-accent-orange'}
                      `}
                  style={{ fontFamily: 'inherit' }}
                >
                  {category}
                </button>
                {idx < categories.length - 1 && (
                  <span className="h-6 sm:h-8 w-[2px] bg-gray-400 mx-1 sm:mx-2 inline-block opacity-40"></span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-full mx-auto justify-items-center px-2 sm:px-0">
          {filteredEvents.map((event) => (
            <div key={event.id} className="w-full max-w-[324.1px] h-auto event-card group relative rounded-xl overflow-hidden">

              {/* Main Content */}
              <div className="relative z-10">
                {/* Event Image */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Event Info */}
                <div className="w-full bg-white border border-gray-200 rounded-b-xl flex items-center justify-between">
                  <div className='flex flex-col gap-1 pl-3 sm:pl-4 py-2'>
                    <p className="text-xs sm:text-sm font-bold whitespace-nowrap">{event.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600">{event.location}</p>
                  </div>
                  <div className='flex items-center py-2 sm:py-3 px-4 sm:px-6 bg-purple-950 text-white border border-b-2 rounded-bl-full'>
                    <p className="mr-1 sm:mr-2 text-[8px] sm:text-[9.9px]">As From</p>
                    <p className="text-xs sm:text-[15.9px]">{event.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* View All Button */}
        <div className="w-full flex items-center justify-center mt-12">
          <button className=" w-[365.4px] h-[76.3px] btn-primary px-12 py-4 text-[21.8px] uppercase tracking-wider">
            VIEW ALL EVENT
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
