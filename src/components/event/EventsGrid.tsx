'use client';

import EventCard from "./eventCard";


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
        organizer: "BLAKKANONYM"
    },
    {
        id: 2,
        title: "Rock Legends Live Concert",
        date: "Fri 28 Nov 2025",
        time: "08:00 PM - 11:30 PM",
        location: "Port Louis Waterfront",
        price: 750,
        ticketsLeft: 18,
        organizer: "ROCK MAURITIUS"
    },
    {
        id: 3,
        title: "Jazz & Blues Night",
        date: "Sat 29 Nov 2025",
        time: "07:30 PM - 12:00 AM",
        location: "Grand Baie La Croisette",
        price: 350,
        ticketsLeft: 56,
        organizer: "BLUES SYNDICATE"
    },
    {
        id: 4,
        title: "EDM Beach Party",
        date: "Sun 30 Nov 2025",
        time: "04:00 PM - 04:00 AM",
        location: "Flic en Flac Beach",
        price: 600,
        ticketsLeft: 23,
        organizer: "BEACH VIBES"
    },
    {
        id: 5,
        title: "Hip Hop & R&B Festival",
        date: "Fri 05 Dec 2025",
        time: "09:00 PM - 03:00 AM",
        location: "Bagatelle Mall of Mauritius",
        price: 450,
        ticketsLeft: 67,
        organizer: "URBAN MAURITIUS"
    },
    {
        id: 6,
        title: "Classical Symphony Orchestra",
        date: "Sun 07 Dec 2025",
        time: "06:00 PM - 09:00 PM",
        location: "Swanseeen Arts Centre",
        price: 300,
        ticketsLeft: 89,
        organizer: "MAURITIUS SYMPHONY"
    },
    {
        id: 7,
        title: "Reggae Sunset Festival",
        date: "Sat 13 Dec 2025",
        time: "05:00 PM - 01:00 AM",
        location: "Trou aux Biches Beach",
        price: 400,
        ticketsLeft: 34,
        organizer: "REGGAE VIBES"
    },
    {
        id: 8,
        title: "Pop Music Extravaganza",
        date: "Fri 19 Dec 2025",
        time: "08:30 PM - 02:30 AM",
        location: "Caudan Waterfront",
        price: 550,
        ticketsLeft: 27,
        organizer: "POP FUSION"
    },
    {
        id: 9,
        title: "Techno Warehouse Party",
        date: "Sat 20 Dec 2025",
        time: "10:00 PM - 06:00 AM",
        location: "Industrial Zone, Phoenix",
        price: 650,
        ticketsLeft: 15,
        organizer: "TECHNO MAURITIUS"
    },
    {
        id: 10,
        title: "Acoustic Night",
        date: "Sun 21 Dec 2025",
        time: "07:00 PM - 11:00 PM",
        location: "Domaine Les Pailles",
        price: 250,
        ticketsLeft: 72,
        organizer: "ACOUSTIC SESSIONS"
    },
    {
        id: 11,
        title: "Bollywood Night",
        date: "Fri 26 Dec 2025",
        time: "08:00 PM - 02:00 AM",
        location: "Mahatma Gandhi Institute",
        price: 480,
        ticketsLeft: 41,
        organizer: "BOLLYWOOD MAURITIUS"
    },
    {
        id: 12,
        title: "New Year's Eve Party",
        date: "Wed 31 Dec 2025",
        time: "09:00 PM - 06:00 AM",
        location: "Various Venues Islandwide",
        price: 800,
        ticketsLeft: 8,
        organizer: "NYE 2026"
    },
];

export default function EventsGrid() {
    // Combine event data with images
    const eventsWithImages = eventsData.map((event, index) => ({
        ...event,
        imageUrl: eventImages[index % eventImages.length]
    }));

    return (
        <div className="w-full py-8 sm:py-12 lg:py-16">
            {/* Header Section */}
            <div className="bg-[#112b38] text-white py-4 px-6 mb-8 flex items-center justify-center gap-4">
                <button className="text-[#c89c6b] font-bold uppercase text-sm hover:text-white transition-colors italic">
                    All Events
                </button>
                <span className="text-white">|</span>
                <button className="text-white font-bold uppercase text-sm hover:text-[#c89c6b] transition-colors italic">
                    This Week
                </button>
                <span className="text-white">|</span>
                <button className="text-white font-bold uppercase text-sm hover:text-[#c89c6b] transition-colors italic">
                    This Month
                </button>
            </div>

            {/* Events List - One card per row */}
            <div className="w-full space-y-6 flex flex-col items-center">
                {eventsWithImages.map((event) => (
                    <EventCard
                        key={event.id}
                        {...event}
                    />
                ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
                <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 text-lg">
                    Load More Events
                </button>
            </div>
        </div>
    );
}