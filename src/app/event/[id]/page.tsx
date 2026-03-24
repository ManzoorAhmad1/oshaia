'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar, MapPin, Clock, Share2, Heart, Bell,
    ChevronLeft, ChevronRight, User, Shield, CreditCard,
    Zap, Ticket as TicketIcon, Check, Info,
    HeartCrack,
    Ticket,
    Play,
    Pause,
    Timer,
    Link2
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram, FaGreaterThan } from 'react-icons/fa';
import TicketHeroSection from '@/components/event/ticketHeroSection';
import NavSearchHeader from '@/components/event/NavSearchHeader';
import { Text } from 'rizzui/typography';
import { Footer } from '@/components/home';
import { useLanguage } from '@/context/LanguageContext';
import EventCard from '@/components/event/eventCard';

interface EventDetailProps {
    params: {
        id: string;
    };
}

const VIDEO_BG = "/Cover%20-/59069_upload68daa2739f40c_1759158899-0-en1759158912.jpg.jpeg";

const artists = [
    {
        name: "Daskill", role: "DJ",
        img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop",
        bio: "Daskill est un DJ, beatmaker et artiste musical. Il partage ses créations musicales avec une énergie incroyable sur scène, fusionnant plusieurs genres musicaux.",
        socials: { instagram: "#", soundcloud: "#", youtube: "#", tiktok: "#" },
    },
    {
        name: "DJ M'RICK", role: "DJ",
        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
        bio: "DJ M'Rick est un DJ et producteur originaire de La Réunion. Actif sur la scène musicale depuis plus de 10 ans, il mixe avec passion et précision.",
        socials: { instagram: "#", facebook: "#", youtube: "#" },
    },
    {
        name: "AVLS", role: "DJ / Producer",
        img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop",
        bio: "AVLS est un producteur et DJ réputé pour ses sets électrisants et ses productions originales qui captivant les foules.",
        socials: { instagram: "#" },
    },
    {
        name: "Moon", role: "DJ",
        img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop",
        bio: "Moon est un DJ talentueux qui mélange les genres avec aisance, créant des ambiances uniques qui font danser le public toute la nuit.",
        socials: { instagram: "#", facebook: "#", tiktok: "#" },
    },
    {
        name: "Mary Jane", role: "DJ",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        bio: "Mary Jane est une DJ dynamique connue pour ses sets énergiques et sa capacité à lire et enflammer la foule, quels que soient l'heure et le lieu.",
        socials: { instagram: "#", facebook: "#" },
    },
    {
        name: "DJ Luvlesh", role: "DJ",
        img: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400&h=400&fit=crop",
        bio: "Originaire de l'Île Maurice, DJ Luvlesh (Luvlesh Désiré) est bien plus qu'un DJ : il est le tout premier à avoir introduit et popularisé l'Amapiano sur l'île.",
        socials: {},
    },
    {
        name: "DJ Darrel", role: "DJ",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "Darrell is a DJ & vibe creator from Mauritius. With more than 8 years behind the decks, he has built a reputation for delivering unforgettable sets.",
        socials: { instagram: "#", facebook: "#", tiktok: "#" },
    },
    {
        name: "DJ Ryan J", role: "DJ / Producer",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        bio: "DJ Ryan J is a DJ and producer known for his unique blend of Afrobeats, R&B, and electronic music that keeps crowds moving all night long.",
        socials: { soundcloud: "#", instagram: "#" },
    },
];

const ARTIST_CLONE = 3;
const artistsExtended = [...artists.slice(-ARTIST_CLONE), ...artists, ...artists.slice(0, ARTIST_CLONE)];

const slides = [
    // 1. First image (always bg for videos too)
    {
        id: 1,
        type: "image",
        url: "/Cover%20-/59069_upload68daa2739f40c_1759158899-0-en1759158912.jpg.jpeg",
        alt: "Event Cover",
        duration: 6,
    },
    // 2. Video 1
    {
        id: 2,
        type: "video",
        url: "/22193_398acba9ebf32f60d280ccecab409d04-1-en1772118332.mp4",
        alt: "Event Video 1",
        bgImage: VIDEO_BG,
        duration: 6,
    },
    // 3. Image
    {
        id: 3,
        type: "image",
        url: "/Cover%20-/rishab_rikhiram_sharma_3764-orig1758879457.jpeg",
        alt: "Rishab Rikhiram Sharma",
        duration: 6,
    },
    // 4. Video 2
    {
        id: 4,
        type: "video",
        url: "/21971_cb42a1d4c3a2dd327fcce42ba642f04c-1-en1771248482.mp4",
        alt: "Event Video 2",
        bgImage: VIDEO_BG,
        duration: 6,
    },
    // 5. Image
    {
        id: 5,
        type: "image",
        url: "/Cover%20-/65370_upload6982ed73b2de6_1770188147-0-en1770188167.jpg.jpeg",
        alt: "Event Cover 3",
        duration: 6,
    },
];

export default function EventDetailPage({ params }: EventDetailProps) {
    const { t }: any = useLanguage();
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'tickets' | 'description' | 'moreInfo'>('tickets');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [playingSongId, setPlayingSongId] = useState<number | null>(null);
    const [songProgress, setSongProgress] = useState<{ [key: number]: number }>({});
    const [relatedCarouselIndex, setRelatedCarouselIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // State for ticket quantities - Initialize properly
    const [ticketQuantities, setTicketQuantities] = useState<{ [key: number]: number }>({});
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
    const [artistCarouselIndex, setArtistCarouselIndex] = useState(ARTIST_CLONE);
    const [artistProgress, setArtistProgress] = useState(0);
    const [artistNoTransition, setArtistNoTransition] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<typeof artists[0] | null>(null);

    const relatedEvents = [
        { id: 1, title: "EN TOUTE INTIMITÉ", location: "Le Suffren Hotel & Spa", price: "RS 450", image: "https://otayo.com/wp-content/uploads/2026/01/zulu-new-grid.jpg", day: "18", month: "Oct", badge: 1 },
        { id: 2, title: "Summer Music Festival", location: "Grand Bay", price: "RS 600", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop", day: "19", month: "Oct", badge: 2 },
        { id: 3, title: "Jazz Night Live", location: "Caudan Waterfront", price: "RS 800", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop", day: "24", month: "Oct", badge: 3 },
        { id: 4, title: "Afrobeats Night", location: "Bagatelle Mall", price: "RS 500", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop", day: "28", month: "Oct", badge: 1 },
        { id: 5, title: "Tropical Vibes", location: "Flic en Flac", price: "RS 350", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop", day: "02", month: "Nov", badge: 2 },
        { id: 6, title: "Rock The Night", location: "Trianon Arena", price: "RS 750", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop", day: "08", month: "Nov", badge: 3 },
    ];
    const cardsPerPage = 3;
    const totalPages = Math.ceil(relatedEvents.length / cardsPerPage);

    const mockSongs = [
        {
            id: 1,
            artist: "Maroon 5",
            title: "Sugar",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop",
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        {
            id: 2,
            artist: "Coldplay",
            title: "Yellow",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop",
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        },
        {
            id: 3,
            artist: "Ed Sheeran",
            title: "Shape of You",
            image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop",
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        },
    ];

    // Refs for each section
    const ticketsRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const moreInfoRef = useRef<HTMLDivElement>(null);
    const tabContentRef = useRef<HTMLDivElement>(null);

    // Mock event data - Replace with actual API call based on params.id
    const event = {
        id: params.id,
        title: "Star for Mental Health",
        subtitle: "ISSA NOEL KAREEMA OKAYLA BEN",
        date: "28 JAN",
        startDate: "2026-04-29T18:00:00",
        fullDate: "Tuesday, 29 Apr 2026 at 06:00 pm",
        endDate: "11:59 pm",
        location: "Venue",
        fullAddress: "123A University Street, Dubai, UAE",
        organizer: "Platinum List",
        images: [
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop"
        ],
        description: "Join us for an unforgettable evening dedicated to raising awareness and support for mental health initiatives. This star-studded event will feature amazing performances and inspiring stories.",
        lineup: [
            { name: "ISSA NOEL", time: "06:00 PM", type: "Opening Act" },
            { name: "KAREEMA", time: "07:30 PM", type: "Main Performance" },
            { name: "OKAYLA BEN", time: "09:00 PM", type: "Headliner" }
        ],
        tickets: [
            {
                id: 1,
                name: "General Admission",
                price: 2500,
                available: 45,
                description: "Standing area access",
                offerEndsIn: "Limited time",
                days: "Days"
            },
            {
                id: 2,
                name: "VIP Package",
                price: 5000,
                available: 12,
                description: "Front row seating + Meet & Greet",
                offerEndsIn: "Flash sale",
                days: "Days"
            },
            {
                id: 3,
                name: "Premium Table",
                price: 15000,
                available: 3,
                description: "Table for 4 + Bottle service",
                offerEndsIn: "Last chance",
                days: "Days"
            }
        ],
        relatedEvents: [
            {
                id: "2",
                title: "Summer Music Festival",
                date: "15 FEB",
                image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop"
            },
            {
                id: "3",
                title: "Jazz Night Live",
                date: "22 FEB",
                image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop"
            }
        ]
    };

    const currentSlideData = slides[currentSlide];

    // Live countdown from event.startDate
    useEffect(() => {
        const target = new Date(event.startDate).getTime();
        const tick = () => {
            const diff = target - Date.now();
            if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0 }); return; }
            setCountdown({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            });
        };
        tick();
        const interval = setInterval(tick, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setArtistProgress(0);
        const step = 100 / (6000 / 50);
        const timer = setInterval(() => {
            setArtistProgress(p => {
                if (p + step >= 100) {
                    clearInterval(timer);
                    setArtistCarouselIndex(idx => idx + 1);
                    return 0;
                }
                return p + step;
            });
        }, 50);
        return () => clearInterval(timer);
    }, [artistCarouselIndex]);

    useEffect(() => {
        if (artistNoTransition) return;
        const min = ARTIST_CLONE;
        const max = ARTIST_CLONE + artists.length - 1;
        if (artistCarouselIndex < min || artistCarouselIndex > max) {
            const t = setTimeout(() => {
                setArtistNoTransition(true);
                const jumpTo = artistCarouselIndex < min
                    ? artistCarouselIndex + artists.length
                    : artistCarouselIndex - artists.length;
                setArtistCarouselIndex(jumpTo);
                requestAnimationFrame(() => requestAnimationFrame(() => setArtistNoTransition(false)));
            }, 510);
            return () => clearTimeout(t);
        }
    }, [artistCarouselIndex, artistNoTransition]);

    // Initialize quantities for tickets on mount only
    useEffect(() => {
        const initialQuantities: { [key: number]: number } = {};
        event.tickets.forEach((ticket) => {
            initialQuantities[ticket.id] = 0;
        });
        setTicketQuantities(initialQuantities);
    }, []);

    // Increment quantity function - Fixed to ensure state updates properly
    const incrementQuantity = (ticketId: number, maxAvailable: number) => {
        setTicketQuantities(prev => {
            const currentQty = prev[ticketId] || 0;
            const newQty = Math.min(currentQty + 1, Math.min(20, maxAvailable));
            return {
                ...prev,
                [ticketId]: newQty
            };
        });
    };

    // Decrement quantity function - Fixed to ensure state updates properly
    const decrementQuantity = (ticketId: number) => {
        setTicketQuantities(prev => {
            const currentQty = prev[ticketId] || 0;
            const newQty = Math.max(currentQty - 1, 0);
            return {
                ...prev,
                [ticketId]: newQty
            };
        });
    };

    // Calculate total amount
    const calculateTotal = () => {
        return event.tickets.reduce((total, ticket) => {
            return total + (ticketQuantities[ticket.id] || 0) * ticket.price;
        }, 0);
    };

    // Check if any ticket is selected (quantity > 0)
    const hasSelectedTickets = () => {
        return Object.values(ticketQuantities).some(quantity => quantity > 0);
    };

    const togglePlay = (song: typeof mockSongs[0]) => {
        if (playingSongId === song.id) {
            audioRef.current?.pause();
            setPlayingSongId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const audio = new Audio(song.audioUrl);
            audioRef.current = audio;
            audio.play();
            setPlayingSongId(song.id);
            audio.ontimeupdate = () => {
                if (audio.duration) {
                    setSongProgress(prev => ({
                        ...prev,
                        [song.id]: (audio.currentTime / audio.duration) * 100,
                    }));
                }
            };
            audio.onended = () => {
                setPlayingSongId(null);
                setSongProgress(prev => ({ ...prev, [song.id]: 0 }));
            };
        }
    };

    // Auto-advance related events carousel every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setRelatedCarouselIndex(prev => (prev + 1) % totalPages);
        }, 3000);
        return () => clearInterval(timer);
    }, [totalPages]);

    // Scroll function
    const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
        if (sectionRef.current) {
            const yOffset = -100;
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleTabClick = (tab: 'tickets' | 'description' | 'moreInfo') => {
        setActiveTab(tab);
    };

    return (
        <div className="relative">

            {/* Background image - from top, not sticky */}
            <div
                className="absolute top-0 left-0 right-0 h-[100vh] blur-sm -z-10 pointer-events-none"
                style={{
                    backgroundImage: `url(${currentSlideData.type === 'video' ? currentSlideData.bgImage : currentSlideData.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat'
                }} />

            <NavSearchHeader />

            {/* Hero Carousel Slider */}
            <TicketHeroSection
                slides={slides}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                currentSlideData={currentSlideData}
            />

            <div className="relative min-h-screen mt-8">
                {/* Main Content */}
                <div className="relative z-10 max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Event Info Bar - Horizontal Layout */}
                            <div className="bg-[#f6f6f6] rounded-xl p-4 sm:p-6 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.08)] border border-white/30">
                                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#112b38] rounded-lg flex items-center justify-center">
                                            <img
                                                src="/images/LOGO TAG/1.png"
                                                alt={event.organizer}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>Choose Your Tickets

                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#112b38] mb-2">
                                            {event.title}
                                        </h2>
                                        <Text className="text-sm sm:text-base text-[#112b38] mb-3">
                                            {t.by} {event.organizer}
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-[#112b38] leading-relaxed line-clamp-2">
                                            {event.description}
                                        </Text>
                                    </div>

                                    <div className="flex-shrink-0 lg:w-[280px] xl:w-[320px]">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-[#112b38] flex-shrink-0" />
                                                <span className="text-[#112b38]">{event.fullDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-[#112b38] flex-shrink-0" />
                                                <span className="text-[#112b38]">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <TicketIcon className="w-4 h-4 text-[#112b38] flex-shrink-0" />
                                                <span className="text-[#112b38]">{t.from} <span className="font-bold text-[#112b38]">Rs 1,000</span></span>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <div className='flex flex-col items-center'>
                                                    <div className="relative bg-[#D24428] w-14 rounded pt-2 pb-1 text-center shadow-sm overflow-hidden">
                                                        <img src="https://imagedelivery.net/eRmbR7weNG-2WY_X8bscGg/b1fd3378-511e-40bc-8156-fda282c5fe00/public" alt="bar" className="absolute top-[23px] left-0 w-full h-[5px] object-cover" />
                                                        <span className="text-2xl sm:text-3xl font-bold text-white leading-none block">{countdown.days}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-xs text-[#112b38] font-medium mt-0.5">{t.days}</span>
                                                </div>
                                                <div className='flex flex-col items-center'>
                                                    <div className="relative bg-[#D24428] w-14 rounded pt-2 pb-1 text-center shadow-sm overflow-hidden">
                                                        <img src="https://imagedelivery.net/eRmbR7weNG-2WY_X8bscGg/b1fd3378-511e-40bc-8156-fda282c5fe00/public" alt="bar" className="absolute top-[23px] left-0 w-full h-[5px] object-cover" />
                                                        <span className="text-2xl sm:text-3xl font-bold text-white leading-none block">{countdown.hours}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-xs text-[#112b38] font-medium mt-0.5">{t.hours}</span>
                                                </div>
                                                <div className='flex flex-col items-center'>
                                                    <div className="relative bg-[#D24428] w-14 rounded pt-2 pb-1 text-center shadow-sm overflow-hidden">
                                                        <img src="https://imagedelivery.net/eRmbR7weNG-2WY_X8bscGg/b1fd3378-511e-40bc-8156-fda282c5fe00/public" alt="bar" className="absolute top-[23px] left-0 w-full h-[5px] object-cover" />
                                                        <span className="text-2xl sm:text-3xl font-bold text-white leading-none block">{countdown.minutes}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-xs text-[#112b38] font-medium mt-0.5">{t.minutes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="w-full bg-white rounded-t-xl shadow-sm border border-gray-100 sticky top-0 z-30">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleTabClick('tickets')}
                                        className={`px-6 py-3.5 text-sm sm:text-base font-semibold transition-all border-b-[3px] whitespace-nowrap ${
                                            activeTab === 'tickets'
                                                ? 'text-[#c89c6b] border-[#c89c6b]'
                                                : 'text-gray-500 border-transparent hover:text-gray-800'
                                        }`}
                                    >
                                        {t.tickets}
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('description')}
                                        className={`px-6 py-3.5 text-sm sm:text-base font-semibold transition-all border-b-[3px] whitespace-nowrap ${
                                            activeTab === 'description'
                                                ? 'text-[#c89c6b] border-[#c89c6b]'
                                                : 'text-gray-500 border-transparent hover:text-gray-800'
                                        }`}
                                    >
                                        {t.description}
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('moreInfo')}
                                        className={`px-6 py-3.5 text-sm sm:text-base font-semibold transition-all border-b-[3px] whitespace-nowrap ${
                                            activeTab === 'moreInfo'
                                                ? 'text-[#c89c6b] border-[#c89c6b]'
                                                : 'text-gray-500 border-transparent hover:text-gray-800'
                                        }`}
                                    >
                                        {t.moreInfo}
                                    </button>
                                </div>
                            </div>
                            {/* Tab Content - one panel at a time, slides up on switch */}
                            <div key={activeTab} className="animate-slide-up">
                            {activeTab === 'tickets' && <div id="tickets-section">
                                <div className="px-0 py-4">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">{t.chooseYourTickets}</h2>
                                    <div className="space-y-3">
                                        {event.tickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-gray-100 rounded-lg overflow-hidden">
                                                {/* Main Ticket Row - always horizontal */}
                                                <div className="px-3 sm:px-4 py-2 flex flex-row items-center justify-between gap-2">
                                                    {/* Ticket Name */}
                                                    <Text className="font-bold text-xs sm:text-sm text-[#112b38] w-[80px] sm:w-[120px] flex-shrink-0 truncate" title={ticket.name}>
                                                        {ticket.name}
                                                    </Text>

                                                    {/* Price */}
                                                    <div className="font-bold text-sm sm:text-lg text-[#112b38] w-[70px] sm:w-[90px] flex-shrink-0">
                                                        Rs{ticket.price.toLocaleString()}
                                                    </div>

                                                    {/* Offer Text - hidden on xs, shown sm+ */}
                                                    <div className="hidden sm:block text-[#112b38] font-semibold text-sm w-[140px] flex-shrink-0 truncate" title={`${ticket.offerEndsIn} 8 ${ticket.days.toLowerCase()}`}>
                                                        {ticket.offerEndsIn} 8 {ticket.days.toLowerCase()}
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                                                        {/* Accordion Toggle Button */}
                                                        <button
                                                            onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                                                            className="w-6 h-6 rounded-full bg-[#112b38] flex items-center justify-center hover:bg-[#c89c6b] hover:scale-110 transition-all duration-300"
                                                        >
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                            </svg>
                                                        </button>

                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center gap-1 sm:gap-2">
                                                            <button
                                                                className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded flex items-center justify-center transition-all duration-300 font-bold text-sm sm:text-base ${ticketQuantities[ticket.id] === 0
                                                                    ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                                                                    : 'hover:bg-[#112b38] hover:text-white hover:border-[#112b38] text-gray-700'
                                                                    }`}
                                                                onClick={() => decrementQuantity(ticket.id)}
                                                                disabled={ticketQuantities[ticket.id] === 0}
                                                            >
                                                                -
                                                            </button>

                                                            <div className="w-8 sm:w-12 text-center font-semibold text-base sm:text-lg">
                                                                {ticketQuantities[ticket.id] !== undefined ? ticketQuantities[ticket.id] : 0}
                                                            </div>

                                                            <button
                                                                className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#c89c6b] rounded flex items-center justify-center transition-all duration-300 font-bold text-sm sm:text-base ${ticketQuantities[ticket.id] === Math.min(20, ticket.available)
                                                                    ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300'
                                                                    : 'text-[#112b38] hover:bg-[#c89c6b] hover:text-white'
                                                                    }`}
                                                                onClick={() => incrementQuantity(ticket.id, ticket.available)}
                                                                disabled={ticketQuantities[ticket.id] === Math.min(20, ticket.available)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Accordion Content */}
                                                {selectedTicket === ticket.id && (
                                                    <div className="px-3 sm:px-4 py-3 bg-white border-t border-gray-200">
                                                        <p className="text-sm text-gray-600">{ticket.description}</p>
                                                        <p className="text-xs text-[#112b38] mt-2">Only {ticket.available} tickets available (Max 20 per person)</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>}

                            {activeTab === 'description' && <div id="description-section">
                                <div className="bg-white rounded-b-xl p-4 sm:p-6 shadow-md border border-t-0 border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">{t.eventDescription}</h2>
                                    <div className="prose max-w-none text-[#112b38] text-sm sm:text-base">
                                        <Text>{event.description}</Text>
                                        <Text className="mt-4">Join us for an unforgettable experience at {event.title}. This event promises to be one of the most exciting gatherings of the year.</Text>
                                    </div>
                                </div>
                            </div>}

                            {activeTab === 'moreInfo' && <div id="moreInfo-section">
                                <div className="bg-white rounded-b-xl p-4 sm:p-6 shadow-md border border-t-0 border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">{t.moreInformation}</h2>
                                    <div className="space-y-4 text-sm sm:text-base text-[#112b38]">
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">{t.ageRestriction}</h3>
                                            <Text>{t.ageRestrictionDesc}</Text>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">{t.parking}</h3>
                                            <Text>{t.parkingDesc}</Text>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">{t.whatToBring}</h3>
                                            <Text>{t.whatToBringDesc}</Text>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            </div> {/* end tab content */}

                            {/* Location Map */}
                            <div className="">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
                                        <div className='flex flex-col items-center justify-center px-2 rounded-lg shadow-md'>
                                            <MapPin className="w-5 h-5 text-[#112b38] flex-shrink-0 mt-1" />
                                            <div className="font-semibold text-sm sm:text-base">{event.location}</div>
                                            <div className="text-xs sm:text-sm text-[#112b38]">{t.location}</div>
                                        </div>
                                        <div>
                                            <Text>Etihad Park</Text>
                                            <Text>{event.fullAddress}</Text>
                                            <Text className='flex gap-2 items-center '>{t.viewDirection} <FaGreaterThan /></Text>
                                        </div>
                                    </div>
                                    <div className="w-full h-[250px] bg-gray-200 rounded-xl overflow-hidden">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.163942789584!2d55.27103831501205!3d25.197196683887764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Site Plan */}
                            <div className="bg-white rounded-xl">
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">{t.sitePlan}</h2>
                                <div className="relative w-full h-[200px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src='/images/mapImage.png'
                                        className='w-full h-full object-cover'
                                        alt="Site Plan"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Share on Social */}
                            <div className="max-w-lg mx-auto bg-white rounded-xl p-6 shadow-lg border border-gray-100/40">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium">Sat 18 Oct</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span>{t.doors}: 20:00</span>
                                        <span>{t.start}: 20:00</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 mt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                            <Timer className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-semibold">{t.buyNow}</p>
                                            <p className="text-xs text-gray-500">{t.saleEndsIn}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 text-center">
                                        {[
                                            { value: "03", label: t.days },
                                            { value: "22", label: t.hours },
                                            { value: "56", label: t.mins },
                                            { value: "17", label: t.seconds },
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <p className="text-lg font-bold text-gray-700">{item.value}</p>
                                                <p className="text-xs text-gray-500">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-6">
                                    <div>
                                        <p className="text-sm text-gray-500">{t.totalAmount}</p>
                                        <p className="text-xl font-bold text-red-500">Rs {calculateTotal().toLocaleString()}</p>
                                    </div>
                                    <button className="bg-[#c89c6b] hover:bg-[#b8885a] text-white font-semibold px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                                        {t.bookNow}
                                    </button>
                                </div>

                                <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-600">
                                    <button className="flex items-center gap-2 hover:text-[#112b38] transition-all duration-300">
                                        <Calendar className="w-4 h-4" /> {t.addToCalendar}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-[#112b38] transition-all duration-300">
                                        <Link2 className="w-4 h-4" /> {t.shareEvent}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-[#112b38] transition-all duration-300">
                                        <HeartCrack className="w-4 h-4" /> {t.addToFavourites}
                                    </button>
                                </div>
                            </div>

                            {/* Related Events - Song Player */}
                            {mockSongs.map((song) => (
                                <div key={song.id} className="relative max-w-xl mx-auto bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between overflow-hidden">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <img
                                                src={song.image}
                                                alt={song.artist}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            {playingSongId === song.id && (
                                                <div className="absolute inset-0 rounded-lg bg-black/20 flex items-center justify-center">
                                                    <div className="flex gap-[2px] items-end h-4">
                                                        <span className="w-[3px] bg-white rounded animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                                                        <span className="w-[3px] bg-white rounded animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                                                        <span className="w-[3px] bg-white rounded animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{song.artist}</p>
                                            <p className="text-sm text-gray-500">{song.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="text-gray-400 hover:text-[#112b38] hover:scale-110 transition-all duration-300">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => togglePlay(song)}
                                            className="w-8 h-8 rounded-full bg-[#112b38] flex items-center justify-center hover:bg-[#c89c6b] transition-all duration-300 hover:scale-110"
                                        >
                                            {playingSongId === song.id
                                                ? <Pause className="w-4 h-4 text-white" />
                                                : <Play className="w-4 h-4 text-white" />
                                            }
                                        </button>
                                    </div>

                                    {/* Progress fill - full div background */}
                                    <div
                                        className="absolute inset-0 bg-blue-100/50 transition-all duration-300 pointer-events-none rounded-xl"
                                        style={{ width: `${songProgress[song.id] || 0}%` }}
                                    />
                                </div>
                            ))}

                            {/* Advertisement */}
                            <div className="bg-gray-200 rounded-xl p-8 sm:p-12 shadow-md border border-gray-300 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                                <div className="text-center">
                                    <div className="text-4xl sm:text-6xl font-bold text-gray-400 mb-2">{t.ads}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">{t.advertisementSpace}</div>
                                </div>
                            </div>

                            {/* Portrait Image */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Artist Slider & Portrait Section */}
            <div className="w-full bg-white py-10">
                <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Performers</span>

                    {/* Cards */}
                    <div
                        className="overflow-hidden relative"
                        style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
                    >
                        <div
                            className="flex"
                            style={{
                                transform: `translateX(calc(-${artistCarouselIndex * 225}px + 50% - 112px))`,
                                transition: artistNoTransition ? 'none' : 'transform 0.5s ease-in-out',
                            }}
                        >
                            {artistsExtended.map((artist, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedArtist(artist)}
                                    className="flex-shrink-0 cursor-pointer transition-all duration-500 px-1"
                                    style={{
                                        width: '225px',
                                        transform: i === artistCarouselIndex ? 'scale(1)' : 'scale(0.88)',
                                        opacity: Math.abs(i - artistCarouselIndex) > 2 ? 0.15 : 1,
                                    }}
                                >
                                    <div
                                        className="relative rounded-xl overflow-hidden cursor-pointer"
                                        style={{
                                            height: '280px',
                                            border: '1px solid rgba(0,0,0,0.08)',
                                        }}
                                    >
                                        {/* Background image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                                            style={{
                                                backgroundImage: `url(${artist.img})`,
                                                transform: i === artistCarouselIndex ? 'scale(1)' : 'scale(1.15)',
                                            }}
                                        />
                                        {/* Progress bar on active card */}
                                        {i === artistCarouselIndex && (
                                            <>
                                                <div className="absolute bottom-0 left-0 h-[4px] bg-white/20 z-20 w-full" />
                                                <div className="absolute bottom-0 left-0 h-[4px] bg-white/80 z-20" style={{ width: `${artistProgress}%`, transition: 'width 0.05s linear' }} />
                                            </>
                                        )}
                                        {/* Overlay */}
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: 'linear-gradient(0deg, rgb(0,0,0) 25%, transparent 100%)' }}
                                        />
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h2 className="text-white font-extrabold text-base mb-0.5 leading-tight">{artist.name}</h2>
                                            <span className="text-white/80 text-xs font-bold block mb-2">{artist.role}</span>
                                            {i === artistCarouselIndex && (
                                                <p className="text-white/70 text-[11px] leading-snug line-clamp-2 mb-2">{artist.bio}</p>
                                            )}
                                            {/* Social icons */}
                                            <div className="flex gap-2 flex-wrap">
                                                {artist.socials.instagram && <a href={artist.socials.instagram} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer"><FaInstagram className="w-5 h-5 text-white/60 hover:text-white transition-colors" /></a>}
                                                {artist.socials.facebook && <a href={artist.socials.facebook} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer"><FaFacebook className="w-5 h-5 text-white/60 hover:text-white transition-colors" /></a>}
                                                {artist.socials.tiktok && <a href={artist.socials.tiktok} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-bold">TT</a>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controls: prev | dots | next */}
                    {(() => {
                        const artistRealIndex = (artistCarouselIndex - ARTIST_CLONE + artists.length * 100) % artists.length;
                        return (
                            <div className="flex items-center justify-between mt-5 gap-3">
                                <button
                                    onClick={() => setArtistCarouselIndex(p => p - 1)}
                                    className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                                </button>

                                <div className="flex items-center justify-center gap-1.5 flex-1">
                                    {artists.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setArtistCarouselIndex(i + ARTIST_CLONE)}
                                            className="rounded-full transition-all duration-300"
                                            style={{
                                                width: i === artistRealIndex ? '24px' : '8px',
                                                height: '8px',
                                                background: i === artistRealIndex ? '#1a1a1a' : 'rgba(0,0,0,0.2)',
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setArtistCarouselIndex(p => p + 1)}
                                    className="w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700" />
                                </button>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Artist Modal */}
            {selectedArtist && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
                    onClick={() => setSelectedArtist(null)}
                >
                    <div
                        className="relative bg-[#0d0d0d] rounded-3xl overflow-hidden max-w-lg w-full shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="relative h-80 w-full">
                            <img src={selectedArtist.img} alt={selectedArtist.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #0d0d0d 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
                            <div className="absolute bottom-5 left-6">
                                <h2 className="text-white font-extrabold text-2xl leading-tight mb-1">{selectedArtist.name}</h2>
                                <span className="text-white/60 text-sm font-semibold tracking-wide uppercase">{selectedArtist.role}</span>
                            </div>
                        </div>
                        {/* Bio */}
                        <div className="px-6 pt-4 pb-5">
                            {selectedArtist.bio && <p className="text-white/70 text-sm leading-relaxed mb-5">{selectedArtist.bio}</p>}
                            {Object.values(selectedArtist.socials).some(Boolean) && (
                                <>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Socials</p>
                                    <div className="flex gap-4">
                                        {selectedArtist.socials.instagram && <a href={selectedArtist.socials.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="w-6 h-6 text-white/50 hover:text-white transition-colors" /></a>}
                                        {selectedArtist.socials.facebook && <a href={selectedArtist.socials.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook className="w-6 h-6 text-white/50 hover:text-white transition-colors" /></a>}
                                        {selectedArtist.socials.tiktok && <a href={selectedArtist.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors text-[11px] font-bold self-center border border-white/20 px-2 py-0.5 rounded">TT</a>}
                                    </div>
                                </>
                            )}
                        </div>
                        <p className="text-center text-white/20 text-[11px] pb-4 tracking-wide">Tap anywhere outside to dismiss</p>
                    </div>
                </div>
            )}

            <div className="w-full sm:w-[85%] mx-auto my-12 px-4 sm:px-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{t.relatedEvents || "Related Events"}</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setRelatedCarouselIndex(prev => (prev - 1 + totalPages) % totalPages)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#112b38] hover:text-white hover:border-[#112b38] transition-all duration-300"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setRelatedCarouselIndex(prev => (prev + 1) % totalPages)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#112b38] hover:text-white hover:border-[#112b38] transition-all duration-300"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${relatedCarouselIndex * 100}%)` }}
                    >
                        {Array.from({ length: totalPages }).map((_, pageIdx) => (
                            <div key={pageIdx} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14  py-8 overflow-visible justify-items-center">
                                {relatedEvents.slice(pageIdx * cardsPerPage, pageIdx * cardsPerPage + cardsPerPage).map((ev) => (
                                    <Link
                                        key={ev.id}
                                        href={`/event/${ev.id}`}
                                        className="w-full max-w-[340px] h-auto event-card relative overflow-visible block cursor-pointer"
                                    >
                                        <div className="hidden sm:block absolute -top-[28px] -left-[59px] w-[420px] h-auto z-50 pointer-events-none">
                                            <img
                                                src={`/images/LOGO TAG/${ev.badge}.png`}
                                                alt="Badge"
                                                className="w-full h-auto object-contain scale-110"
                                            />
                                        </div>
                                        <div className="relative z-10 overflow-hidden rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl bg-white">
                                            <div className="relative w-full h-[340px] overflow-hidden">
                                                <Image
                                                    src={ev.image}
                                                    alt={ev.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                                <div className="absolute top-3 right-3 bg-black/70 rounded shadow-lg overflow-hidden z-20 px-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-lg sm:text-xl font-bold text-white leading-none">{ev.day}</div>
                                                        <div className="text-sm sm:text-base font-bold text-white uppercase">{ev.month}</div>
                                                    </div>
                                                </div>
                                                {/* White dot indicators overlaid on image */}
                                                {pageIdx === 0 && (
                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                                        {Array.from({ length: totalPages }).map((_, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={(e) => { e.preventDefault(); setRelatedCarouselIndex(i); }}
                                                                className={`rounded-full transition-all duration-300 ${i === relatedCarouselIndex
                                                                        ? 'w-5 h-2 bg-white'
                                                                        : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-full bg-white flex items-stretch justify-between border border-[#7e7b7b] border-t-0 rounded-bl-2xl rounded-br-lg overflow-hidden">
                                                <div className='flex flex-col justify-center pl-3 sm:pl-4 py-2 sm:py-3'>
                                                    <p className="text-xs sm:text-sm font-bold whitespace-nowrap text-gray-900">{ev.title}</p>
                                                    <p className="text-[10px] sm:text-xs text-[#112b38]">{ev.location}</p>
                                                </div>
                                                <div className='w-[135px] bg-[#112b38] hover:bg-[#c89c6b] flex-shrink-0 flex flex-col items-center justify-center py-2 sm:py-3 px-4 sm:px-6 text-white rounded-bl-3xl transition-colors duration-300 relative z-10'>
                                                    <p className="mr-1 sm:mr-2 text-[8px] sm:text-[9.9px]">{t.asFrom}</p>
                                                    <p className="text-xs sm:text-[15.9px]">{ev.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}