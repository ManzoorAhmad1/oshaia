'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';

interface ApiEvent {
  _id: string;
  title: { en: string; fr: string };
  category: string;
  startDate: string;
  startTime?: string;
  endTime?: string;
  venue: { en: string; fr: string };
  address?: { en: string; fr: string };
  coverImage?: string;
  ticketTypes: Array<{ name: { en: string; fr: string }; price: number; totalSeats: number; availableSeats?: number; sold?: number }>;
  badge?: string;
  organizer?: string;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PAGE_SIZE = 9;

export default function EventsGrid() {
    const { t, language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const categories = ['ALL', 'CONCERT', 'FESTIVAL', 'CONFERENCES', 'SHOW', 'SPORT', 'INTERNATIONAL'];
    const categoryLabels: Record<string, string> = {
        'ALL': t.categoryAll,
        'CONCERT': t.categoryConcert,
        'INTERNATIONAL': t.categoryInternational,
        'FESTIVAL': t.categoryFestival,
        'CONFERENCES': t.categoryConferences,
        'SHOW': t.categoryShow,
        'SPORT': t.categorySport,
    };

    const getTitle = (ev: ApiEvent) => language === 'fr' ? (ev.title?.fr || ev.title?.en) : (ev.title?.en || ev.title?.fr);
    const getVenue = (ev: ApiEvent) => language === 'fr' ? (ev.venue?.fr || ev.venue?.en) : (ev.venue?.en || ev.venue?.fr);
    const getMinPrice = (ev: ApiEvent) => ev.ticketTypes?.length ? Math.min(...ev.ticketTypes.map(t => t.price)) : 0;
    const getImageSrc = (ev: ApiEvent) => getImageUrl(ev.coverImage);
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        return `${days[d.getDay()]} ${String(d.getDate()).padStart(2,'0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    };
    const getTotalLeft = (ev: ApiEvent) => {
        if (!ev.ticketTypes?.length) return 0;
        return ev.ticketTypes.reduce((sum, t) => sum + (t.availableSeats ?? t.totalSeats ?? 0), 0);
    };

    useEffect(() => {
        setPage(1);
        setEvents([]);
    }, [activeCategory]);

    useEffect(() => {
        setIsLoading(true);
        const params: Record<string, string | number> = { page, limit: PAGE_SIZE };
        if (activeCategory !== 'ALL') params.category = activeCategory;
        api.get('/events', { params })
            .then(res => {
                const data = res.data;
                const list: ApiEvent[] = data.data?.events ?? data.events ?? [];
                const total: number = data.data?.total ?? data.total ?? list.length;
                setEvents(prev => page === 1 ? list : [...prev, ...list]);
                setHasMore((page * PAGE_SIZE) < total);
            })
            .catch(() => setEvents([]))
            .finally(() => setIsLoading(false));
    }, [activeCategory, page]);

    return (
        <div className="w-full mb-6 sm:mb-8 md:mb-10">
            <div className="w-full my-6 sm:my-8 md:my-10 overflow-x-auto border-gray-200 bg-[#112b38]">
                <div className="flex justify-start sm:justify-center items-center gap-0 min-w-max sm:min-w-0 py-2">
                    {categories.map((category, idx) => (
                        <React.Fragment key={category}>
                            <button
                                onClick={() => setActiveCategory(category)}
                                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-sm sm:text-base md:text-[1.3rem] font-extrabold uppercase tracking-[0.02em] transition-all duration-300 cursor-pointer relative whitespace-nowrap
                                    ${activeCategory === category ? 'text-[#c89c6b]' : 'text-white hover:text-[#c89c6b]'}`}
                            >
                                {categoryLabels[category] || category}
                            </button>
                            {idx < categories.length - 1 && (
                                <span className="h-6 sm:h-8 w-[2px] bg-[#c89c6b] mx-1 sm:mx-2 inline-block opacity-40" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Events List */}
            <div className="w-full max-w-[83%] mx-auto space-y-6 sm:space-y-8 md:space-y-10 flex flex-col items-center">
                {isLoading && page === 1 ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="w-full h-[200px] bg-gray-200 animate-pulse rounded-2xl" />
                    ))
                ) : events.length === 0 ? (
                    <p className="py-16 text-center text-gray-500">{t.noEventsFound || 'No events found.'}</p>
                ) : (
                    events.map((event) => (
                        <Link key={event._id} href={`/event/${event._id}`} className="w-full block">
                            <div className="bg-white rounded-xl w-full mx-auto overflow-hidden border border-black cursor-pointer hover:shadow-lg transition-shadow duration-200 p-4">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Event Image */}
                                    <div className="relative w-full sm:w-[200px] md:w-[240px] lg:w-[270px] h-[180px] sm:h-auto flex-shrink-0">
                                        <Image
                                            src={getImageSrc(event)}
                                            alt={getTitle(event) || 'Event'}
                                            fill
                                            className="object-cover rounded-lg"
                                            sizes="(max-width: 640px) 100vw, 370px"
                                        />
                                    </div>
                                    {/* Right Section */}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        {/* Title Row */}
                                        <div className="px-4 pt-4 pb-2">
                                            <h3 className="text-base sm:text-lg font-extrabold text-[#112b38] uppercase leading-tight line-clamp-2 tracking-wide">
                                                {getTitle(event)}
                                            </h3>
                                        </div>
                                        {/* Dark Band: Date & Location with background image */}
                                        <div
                                            className="relative px-4 h-40 flex flex-col gap-2 overflow-hidden justify-center"
                                            style={{
                                                backgroundImage: `url(${getImageSrc(event)})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            {/* Dark overlay */}
                                            <div className="absolute inset-0 bg-[#112b38]/60" />
                                            <div className="relative flex items-center gap-2 text-white text-sm">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span>{formatDate(event.startDate)}{event.startTime ? ` at ${event.startTime}` : ''}</span>
                                            </div>
                                            <div className="relative flex items-center gap-2 text-white text-sm">
                                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                                <span>{getVenue(event)}</span>
                                            </div>
                                        </div>
                                        {/* Bottom: Price + Button */}
                                        <div className="flex items-center justify-between px-4 pt-4 gap-2">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Ticket className="w-5 h-5 text-gray-500" />
                                                <span className="text-gray-500 font-medium">{t.asFrom || 'As From'}</span>
                                                <span className="text-[#c89c6b] font-extrabold text-lg">Rs {getMinPrice(event)}</span>
                                            </div>
                                            <button className="border border-[#c89c6b] text-[#c89c6b] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-wide hover:bg-[#c89c6b] hover:text-white transition-colors duration-200 whitespace-nowrap">
                                                {t.getTicketsHere || 'GET TICKETS HERE'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="w-full max-w-[75%] mx-auto flex items-center justify-center mt-6 sm:mt-8 md:mt-10">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={isLoading}
                        className="w-auto h-[35px] sm:h-[40px] md:h-[45px] bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] hover:bg-[#112b38] hover:text-[#c89c6b] px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-sm sm:text-base md:text-lg uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap flex items-center justify-center disabled:opacity-60"
                    >
                        {isLoading ? '...' : (t.loadMoreEvents || 'Load More')}
                    </button>
                </div>
            )}
        </div>
    );
}