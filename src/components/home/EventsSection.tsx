"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useCms } from '@/lib/useCms'
import api from '@/lib/api'
import { getImageUrl } from '@/lib/imageUrl'

interface ApiEvent {
  id?: number | string;
  _id?: string;
  title: { en: string; fr: string };
  category: string;
  startDate: string;
  venue: { en: string; fr: string };
  coverImage?: string;
  bannerSquare?: string;
  bannerLandscape?: string;
  ticketTypes: Array<{ price: number }>;
  badge?: string;
  earlyBird?: boolean;
  slug: string;
}

// Maps event badge text → LOGO TAG image number
const BADGE_IMAGE_MAP: Record<string, number> = {
  'FINAL RELEASE': 1, 'LIMITED TICKETS': 2, 'BUY 2 GET 1 FREE': 3,
  'LAST CHANCE': 4, 'FLASH SALE': 5, 'PHASE 4': 6, 'PHASE 3': 7,
  'PHASE 2': 8, 'PHASE 1': 9, 'EXCLUSIVE': 10, 'SELLING FAST': 11,
  'EARLY ACCESS': 12, 'EARLY BIRD': 13, 'SOLD OUT': 14, 'LAST TICKETS': 15,
};

const getBadgeImage = (event: ApiEvent): number | null => {
  if (event.badge && BADGE_IMAGE_MAP[event.badge]) return BADGE_IMAGE_MAP[event.badge];
  if (event.earlyBird) return 13; // EARLY BIRD
  return null;
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const EventsSection = () => {
  const { t, language } = useLanguage()
  const { get: getCms, content: homeCms } = useCms('home')
  const showBadge = (() => {
    const vis = homeCms['events']?.extra?.showBadge;
    return vis === undefined || vis === null || vis === true || vis === 'true' || vis === 1 || vis === '1';
  })();
  const [activeCategory, setActiveCategory] = useState('all')
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Category keys mapping to translations
  const categoryKeys = ['all', 'concert', 'festival', 'conferences', 'show', 'sport', 'international'] as const

  const getCategoryLabel = (key: string) => {
    const labels: Record<string, string> = {
      all: t.all,
      concert: t.concert,
      festival: t.festival,
      conferences: t.conferences,
      show: t.show,
      sport: t.sport,
      international: t.categoryInternational || 'INTERNATIONAL',
    }
    return labels[key] || key
  }

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCategory !== 'all') params.category = activeCategory.toUpperCase();
    api.get('/events', { params })
      .then(res => setEvents(res.data.data?.events ?? res.data.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, [activeCategory])

  const getTitle = (ev: ApiEvent) => language === 'fr' ? (ev.title?.fr || ev.title?.en) : (ev.title?.en || ev.title?.fr)
  const getVenue = (ev: ApiEvent) => language === 'fr' ? (ev.venue?.fr || ev.venue?.en) : (ev.venue?.en || ev.venue?.fr)
  const getMinPrice = (ev: ApiEvent) => {
    if (!ev.ticketTypes?.length) return 'FREE';
    const min = Math.min(...ev.ticketTypes.map(t => t.price));
    return `RS ${min}`;
  }
  const getDay = (dateStr: string) => { const d = new Date(dateStr); return String(d.getDate()).padStart(2,'0'); }
  const getMonth = (dateStr: string) => { const d = new Date(dateStr); return MONTHS[d.getMonth()]; }
  const getImageSrc = (ev: ApiEvent) => getImageUrl(ev.bannerSquare || ev.bannerLandscape || ev.coverImage);

  return (
    <section className="mt-10 sm:mt-8 md:mt-10 pb-8 sm:pb-8 md:pb-10">
      {/* Section Title - 85% centered */}
      <div className="w-full sm:w-[85%] mx-auto px-4 sm:px-0">
        <h2 className="section-title text-black my-4 mb-8">
          {language === 'fr'
            ? (getCms('events').title?.fr || t.allEvent)
            : (getCms('events').title?.en || t.allEvent)}
        </h2>
      </div>

      {/* Category Tabs - full width */}
      <div className="w-full mb-6 sm:mb-8 border-gray-200 bg-[#112b38] py-2">
        <div className="flex flex-wrap justify-center items-center gap-0">
          {categoryKeys.map((category, idx) => (
            <React.Fragment key={category}>
              <button
                onClick={() => setActiveCategory(category)}
                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-sm sm:text-base md:text-[1.3rem] font-extrabold uppercase tracking-[0.02em] cursor-pointer relative whitespace-nowrap
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
      <div className="w-full sm:w-[85%] mx-auto px-4 sm:px-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-8 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full max-w-[340px] h-[400px] bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-16 text-center text-gray-500">No events found.</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14 md:gap-16 lg:gap-20 py-8 overflow-visible justify-items-center">
          {events.map((event, index) => (
            <Link
              key={event.id ?? event._id}
              href={`/event/${event.id ?? event._id}`}
              className="w-full max-w-[340px] h-auto event-card relative overflow-visible block cursor-pointer"
            >
              {/* Badge Image at Top Left */}
              {showBadge && (() => { const badgeNum = getBadgeImage(event); return badgeNum ? (
              <div className="hidden sm:block absolute -top-[28px] -left-[59px] w-[420px] h-auto z-50 pointer-events-none">
                <img
                  src={`/images/LOGO TAG/${badgeNum}.png`}
                  alt="Badge"
                  className="w-full h-auto object-contain scale-110"
                />
              </div>
              ) : null; })()}

              {/* Main Content */}
              <div className="relative z-10 overflow-hidden rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl bg-white">
                {/* Event Image */}
                <div className="relative w-full h-[340px] overflow-hidden">
                  <Image
                    src={getImageSrc(event)}
                    alt={getTitle(event) || 'Event'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                  />

                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 rounded shadow-lg overflow-hidden z-20 px-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <div className="text-lg sm:text-xl font-bold text-white leading-none">{getDay(event.startDate)}</div>
                      <div className="text-sm sm:text-base font-bold text-white uppercase">{getMonth(event.startDate)}</div>
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="w-full bg-white flex items-stretch justify-between border border-[#7e7b7b] border-t-0 rounded-bl-2xl rounded-br-lg overflow-hidden">
                  <div className='flex flex-col justify-center pl-3 sm:pl-4 py-2 sm:py-3 min-w-0 flex-1 overflow-hidden'>
                    <p className="text-xs sm:text-sm font-bold truncate">{getTitle(event)}</p>
                    <p className="text-[10px] sm:text-xs text-[#112b38] truncate">{getVenue(event)}</p>
                  </div>
                  <div className='w-[135px] bg-[#112b38] hover:bg-[#c89c6b] flex-shrink-0 flex flex-col items-center justify-center py-2 sm:py-3 px-4 sm:px-6 text-white rounded-bl-3xl transition-colors duration-300 relative z-10'>
                    <p className="mr-1 sm:mr-2 text-[8px] sm:text-[9.9px]">{t.asFrom}</p>
                    <p className="text-xs sm:text-[15.9px]">{getMinPrice(event)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

        {/* View All Button */}
        <div className="w-full flex items-center justify-center mt-2 sm:mt-3 md:mt-4">
          <Link href="/event" className="w-[200px] h-[35px] sm:h-[40px] md:h-[45px] bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] hover:bg-[#112b38] hover:text-white px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base md:text-lg uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap flex items-center justify-center">
            {t.viewAllEvent}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default EventsSection