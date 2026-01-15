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
    <section className="">
      <div className="">
        {/* Section Title */}
        <h2 className="section-title text-black">ALL EVENT</h2>

        {/* Category Tabs */}
        <div className="w-full flex justify-center items-center gap-0 mb-12 border-b border-gray-200 bg-[#07114A]">
          {categories.map((category, idx) => (
            <React.Fragment key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`px-8 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer relative 
                      ${activeCategory === category 
                        ? 'text-accent-orange italic' 
                        : 'text-white hover:text-accent-orange'}
                    `}
                    style={{ fontFamily: 'inherit' }}
                  >
                    {category}
                  </button>
              {idx < categories.length - 1 && (
                <span className="h-8 w-[2px] bg-gray-400 mx-2 inline-block opacity-40"></span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-20">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card group">
              {/* Event Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden rounded-t-xl">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge */}
                {event.badge && (
                  <div className={`absolute top-4 left-4 ${event.badgeColor} px-3 py-1 rounded-md text-white text-xs font-bold uppercase`}>
                    {event.badge}
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="p-5 bg-white border border-gray-200 rounded-b-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {event.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-accent-orange" />
                    <span>{event.date}</span>
                    <Clock className="w-4 h-4 ml-4 mr-2 text-accent-orange" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-accent-orange" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-accent-orange font-bold text-base">
                    From {event.price}
                  </div>
                  <button className="px-5 py-2 bg-secondary-purple hover:bg-secondary-purple/80 rounded-lg text-white text-sm font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <button className="btn-primary px-12 py-4 text-lg uppercase tracking-wider">
            VIEW ALL EVENT
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
