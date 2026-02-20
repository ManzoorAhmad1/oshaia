'use client';

import React, { useState } from 'react';
import EventCard from "./eventCard";
import { useLanguage } from '@/context/LanguageContext';


// Unsplash images for events
export const eventImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f6f2615f5568?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f6f2615f5568?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop',
];

// Sample events data
export const eventsData = [
    {
        id: 1,
        title: "Electronic Dance Music Festival",
        date: "Sun 23 Nov 2025",
        time: "06:57 PM - 02:00 AM",
        location: "Vacoas, Mauritius",
        price: 500,
        ticketsLeft: 42,
        organizer: "BLAKKANONYM",
        category: "FESTIVAL"
    },
    {
        id: 2,
        title: "Rock Legends Live Concert",
        date: "Fri 28 Nov 2025",
        time: "08:00 PM - 11:30 PM",
        location: "Port Louis Waterfront",
        price: 750,
        ticketsLeft: 18,
        organizer: "ROCK MAURITIUS",
        category: "CONCERT"
    },
    {
        id: 3,
        title: "Jazz & Blues Night",
        date: "Sat 29 Nov 2025",
        time: "07:30 PM - 12:00 AM",
        location: "Grand Baie La Croisette",
        price: 350,
        ticketsLeft: 56,
        organizer: "BLUES SYNDICATE",
        category: "SHOW"
    },
    {
        id: 4,
        title: "EDM Beach Party",
        date: "Sun 30 Nov 2025",
        time: "04:00 PM - 04:00 AM",
        location: "Flic en Flac Beach",
        price: 600,
        ticketsLeft: 23,
        organizer: "BEACH VIBES",
        category: "FESTIVAL"
    },
    {
        id: 5,
        title: "Hip Hop & R&B Festival",
        date: "Fri 05 Dec 2025",
        time: "09:00 PM - 03:00 AM",
        location: "Bagatelle Mall of Mauritius",
        price: 450,
        ticketsLeft: 67,
        organizer: "URBAN MAURITIUS",
        category: "CONCERT"
    },
    {
        id: 6,
        title: "Classical Symphony Orchestra",
        date: "Sun 07 Dec 2025",
        time: "06:00 PM - 09:00 PM",
        location: "Swanseeen Arts Centre",
        price: 300,
        ticketsLeft: 89,
        organizer: "MAURITIUS SYMPHONY",
        category: "SHOW"
    },
    {
        id: 7,
        title: "Reggae Sunset Festival",
        date: "Sat 13 Dec 2025",
        time: "05:00 PM - 01:00 AM",
        location: "Trou aux Biches Beach",
        price: 400,
        ticketsLeft: 34,
        organizer: "REGGAE VIBES",
        category: "FESTIVAL"
    },
    {
        id: 8,
        title: "Pop Music Extravaganza",
        date: "Fri 19 Dec 2025",
        time: "08:30 PM - 02:30 AM",
        location: "Caudan Waterfront",
        price: 550,
        ticketsLeft: 27,
        organizer: "POP FUSION",
        category: "CONCERT"
    },
    {
        id: 9,
        title: "Tech Conference 2025",
        date: "Sat 20 Dec 2025",
        time: "10:00 AM - 06:00 PM",
        location: "Industrial Zone, Phoenix",
        price: 650,
        ticketsLeft: 15,
        organizer: "TECH MAURITIUS",
        category: "CONFERENCES"
    },
    {
        id: 10,
        title: "Acoustic Night",
        date: "Sun 21 Dec 2025",
        time: "07:00 PM - 11:00 PM",
        location: "Domaine Les Pailles",
        price: 250,
        ticketsLeft: 72,
        organizer: "ACOUSTIC SESSIONS",
        category: "SHOW"
    },
    {
        id: 11,
        title: "Football Championship",
        date: "Fri 26 Dec 2025",
        time: "08:00 PM - 02:00 AM",
        location: "Mahatma Gandhi Institute",
        price: 480,
        ticketsLeft: 41,
        organizer: "SPORT MAURITIUS",
        category: "SPORT"
    },
    {
        id: 12,
        title: "New Year's Eve Party",
        date: "Wed 31 Dec 2025",
        time: "09:00 PM - 06:00 AM",
        location: "Various Venues Islandwide",
        price: 800,
        ticketsLeft: 8,
        organizer: "NYE 2026",
        category: "FESTIVAL"
    },
];

export default function EventsGrid() {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('ALL');
    const categories = ['ALL', 'CONCERT', 'FESTIVAL', 'CONFERENCES', 'SHOW', 'SPORT'];
    
    // Category translation map
    const categoryLabels: { [key: string]: string } = {
        'ALL': t.categoryAll,
        'CONCERT': t.categoryConcert,
        'FESTIVAL': t.categoryFestival,
        'CONFERENCES': t.categoryConferences,
        'SHOW': t.categoryShow,
        'SPORT': t.categorySport,
    };

    // Combine event data with images
    const eventsWithImages = eventsData.map((event, index) => ({
        ...event,
        imageUrl: eventImages[index % eventImages.length]
    }));

    // Filter events based on active category
    const filteredEvents = activeCategory === 'ALL'
        ? eventsWithImages
        : eventsWithImages.filter(event => event.category === activeCategory);

    return (
        <div className="w-full">
            <div className="w-full  my-6 overflow-x-auto border-gray-200 bg-[#112b38]">
                <div className="flex justify-start sm:justify-center items-center gap-0 min-w-max sm:min-w-0">
                    {categories.map((category, idx) => (
                        <React.Fragment key={category}>
                            <button
                                onClick={() => setActiveCategory(category)}
                                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer relative whitespace-nowrap
                                    ${activeCategory === category
                                        ? 'text-[#c89c6b]'
                                        : 'text-white hover:text-[#c89c6b]'}
                                `}
                            >
                                {categoryLabels[category] || category}
                            </button>
                            {idx < categories.length - 1 && (
                                <span className="h-6 sm:h-8 w-[2px] bg-[#c89c6b] mx-1 sm:mx-2 inline-block opacity-40"></span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Events List - One card per row */}
            <div className="w-full space-y-6 flex flex-col items-center">
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        {...event}
                    />
                ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-6">
                <button className="bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] px-4 py-1.5 rounded-full font-semibold hover:bg-[#112b38] hover:text-[#c89c6b] hover:border-[#112b38] hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider shadow-lg hover:shadow-xl">
                    {t.loadMoreEvents}
                </button>
            </div>
        </div>
    );
}