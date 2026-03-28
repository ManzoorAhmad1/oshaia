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
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram, FaGreaterThan, FaCalendarAlt, FaShareAlt, FaHeart } from 'react-icons/fa';
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

    // Collapse states for each section
    const [isTicketsCollapsed, setIsTicketsCollapsed] = useState(false);
    const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
    const [isMoreInfoCollapsed, setIsMoreInfoCollapsed] = useState(false);
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

        // Get the target ref based on tab
        let targetRef: React.RefObject<HTMLDivElement> | null = null;
        if (tab === 'tickets') targetRef = ticketsRef;
        else if (tab === 'description') targetRef = descriptionRef;
        else if (tab === 'moreInfo') targetRef = moreInfoRef;

        if (targetRef?.current && tabContentRef.current) {
            // Scroll within the tab content container
            const containerTop = tabContentRef.current.offsetTop;
            const elementTop = targetRef.current.offsetTop;
            const scrollPosition = elementTop - containerTop;

            tabContentRef.current.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative">

            {/* Background image - matches reference: fixed height, dark inside overlay, gradient below */}
            <div
                className="absolute top-0 left-0 right-0 -z-10 pointer-events-none overflow-hidden"
                style={{
                    backgroundImage: `url(${currentSlideData.type === 'video' ? currentSlideData.bgImage : currentSlideData.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(9px)',
                    WebkitFilter: 'blur(9px)',
                    transform: 'scale(1.1)',
                    height: '717px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                }}
            >
                {/* inside overlay – ~55% black opacity */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
                {/* gradient below – fade to white */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[160px]"
                    style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0.92) 100%)' }}
                />
            </div>

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
                                    <div className="flex-shrink-0 mx-auto lg:mx-0">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40">
                                            <img
                                                src="/images/Logo/ALL PNG-01.png"
                                                alt={event.organizer}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                    </div>

                                    <div className="flex-1 min-w-0 text-center lg:text-left">
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 ">
                                            {event.title}
                                        </h2>
                                        <Text className="text-sm sm:text-base text-[#c89c6b] mb-3">
                                            {t.by} {event.organizer}
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-[#c89c6b] leading-relaxed line-clamp-2">
                                            {event.description}
                                        </Text>
                                    </div>

                                    <div className="flex-shrink-0 lg:w-[280px] xl:w-[320px]">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm group">
                                                <Clock className="w-4 h-4 text-[#c89c6b] group-hover:text-[#112b38] flex-shrink-0 transition-colors" />
                                                <span className="text-[#c89c6b]">{event.fullDate}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm group">
                                                <MapPin className="w-4 h-4 text-[#c89c6b] group-hover:text-[#112b38] flex-shrink-0 transition-colors" />
                                                <span className="text-[#c89c6b]">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm group">
                                                <TicketIcon className="w-4 h-4 text-[#c89c6b] group-hover:text-[#112b38] flex-shrink-0 transition-colors" />
                                                <span className="text-[#c89c6b]">{t.from} <span className="font-bold text-[#c89c6b]">Rs 1,000</span></span>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <div className='flex flex-col items-center'>
                                                    <div className="relative bg-[#D24428] w-14 rounded pt-2 pb-1 text-center shadow-sm overflow-hidden">
                                                        <img src="https://imagedelivery.net/eRmbR7weNG-2WY_X8bscGg/b1fd3378-511e-40bc-8156-fda282c5fe00/public" alt="bar" className="absolute top-[23px] left-0 w-full h-[5px] object-cover" />
                                                        <span className="text-2xl sm:text-3xl font-bold text-white leading-none block">{countdown.days}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-xs text-[#c89c6b] font-medium mt-0.5">{t.days}</span>
                                                </div>
                                                <div className='flex flex-col items-center'>
                                                    <div className="relative bg-[#D24428] w-14 rounded pt-2 pb-1 text-center shadow-sm overflow-hidden">
                                                        <img src="https://imagedelivery.net/eRmbR7weNG-2WY_X8bscGg/b1fd3378-511e-40bc-8156-fda282c5fe00/public" alt="bar" className="absolute top-[23px] left-0 w-full h-[5px] object-cover" />
                                                        <span className="text-2xl sm:text-3xl font-bold text-white leading-none block">{countdown.hours}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-xs text-[#c89c6b] font-medium mt-0.5">{t.hours}</span>
                                                </div>
                                                <div className='flex flex-col items-center'>
                                                    <div className="relative bg-[#D24428] w-14 rounded pt-2 pb-1 text-center shadow-sm overflow-hidden">
                                                        <img src="https://imagedelivery.net/eRmbR7weNG-2WY_X8bscGg/b1fd3378-511e-40bc-8156-fda282c5fe00/public" alt="bar" className="absolute top-[23px] left-0 w-full h-[5px] object-cover" />
                                                        <span className="text-2xl sm:text-3xl font-bold text-white leading-none block">{countdown.minutes}</span>
                                                    </div>
                                                    <span className="text-[11px] sm:text-xs text-[#c89c6b] font-medium mt-0.5">{t.minutes}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className=" w-full flex items-center justify-end gap-1 sm:gap-1.5 hover:text-[#112b38] transition-all duration-300 text-xs sm:text-sm text-gray-600">
                                <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="whitespace-nowrap hidden sm:inline">{t.addToFavourites}</span>
                                <span className="whitespace-nowrap sm:hidden">Favorites</span>
                            </button>

                            {/* Tabs Navigation */}
                            <div className="w-full bg-white z-30">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleTabClick('tickets')}
                                        className={`px-6 py-3.5 text-sm sm:text-base font-semibold transition-all border-b-[3px] whitespace-nowrap ${activeTab === 'tickets'
                                            ? 'text-[#c89c6b] border-[#c89c6b]'
                                            : 'text-gray-500 border-transparent hover:text-gray-800'
                                            }`}
                                    >
                                        {t.tickets}
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('description')}
                                        className={`px-6 py-3.5 text-sm sm:text-base font-semibold transition-all border-b-[3px] whitespace-nowrap ${activeTab === 'description'
                                            ? 'text-[#c89c6b] border-[#c89c6b]'
                                            : 'text-gray-500 border-transparent hover:text-gray-800'
                                            }`}
                                    >
                                        {t.description}
                                    </button>
                                    <button
                                        onClick={() => handleTabClick('moreInfo')}
                                        className={`px-6 py-3.5 text-sm sm:text-base font-semibold transition-all border-b-[3px] whitespace-nowrap ${activeTab === 'moreInfo'
                                            ? 'text-[#c89c6b] border-[#c89c6b]'
                                            : 'text-gray-500 border-transparent hover:text-gray-800'
                                            }`}
                                    >
                                        {t.moreInfo}
                                    </button>
                                </div>
                            </div>
                            {/* Tab Content - All sections visible in scrollable container */}
                            <div ref={tabContentRef} className="space-y-8 max-h-[600px] overflow-y-auto scroll-smooth px-1 tab-scroll-visible">
                                {/* Tickets Section */}
                                <div ref={ticketsRef} id="tickets-section">
                                    {/* Collapsible Header */}
                                    <button
                                        onClick={() => setIsTicketsCollapsed(!isTicketsCollapsed)}
                                        className="w-full flex items-center justify-between py-4 px-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg
                                                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isTicketsCollapsed ? '-rotate-90' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            <h2 className="text-xl sm:text-2xl font-bold">{t.chooseYourTickets}</h2>
                                        </div>
                                    </button>

                                    {!isTicketsCollapsed && (
                                        <div className="px-0 py-4">
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
                                    )}
                                </div>

                                {/* Description Section */}
                                <div ref={descriptionRef} id="description-section">
                                    <div className="bg-white border-t border-b border-gray-200 mt-4">
                                        {/* Collapsible Header */}
                                        <button
                                            onClick={() => setIsDescriptionCollapsed(!isDescriptionCollapsed)}
                                            className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isDescriptionCollapsed ? '-rotate-90' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                <h2 className="text-xl sm:text-2xl font-bold text-[#112b38]">{t.eventDescription}</h2>
                                            </div>
                                        </button>

                                        {!isDescriptionCollapsed && (
                                            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                                <div className="prose max-w-none text-[#112b38] text-sm sm:text-base space-y-4">
                                                    <Text>{event.description}</Text>

                                                    {/* What To Expect */}
                                                    <div className="mt-6">
                                                        <h3 className="font-bold text-lg text-[#112b38] mb-3">⭕️ WHAT TO EXPECT</h3>
                                                        <ul className="space-y-2">
                                                            {[
                                                                'International Artists headlining the event',
                                                                'More than 6 local support artists',
                                                                'Music Genre: Afro-House / Afro-Tech / Electronic',
                                                                'Open-Air garden & beach venue at a 5★ resort',
                                                                'Exclusive 2hr headliner set recorded LIVE',
                                                                'Signature stage design with giant LED screens',
                                                                'New sitting areas & lounges for ALL zones',
                                                                'Exclusive Backstage access for VIPs & VVIPs',
                                                                'Exclusive Meet & Greet Area for VVIPs',
                                                                'Dedicated washrooms per zone',
                                                                'Multiple food & beverage corners',
                                                                'Fire Breathers, Laser Show & more surprises',
                                                            ].map((item, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-[#112b38] text-sm">
                                                                    <span className="mt-1 w-3 h-3 rounded-sm bg-[#112b38] flex-shrink-0 inline-block" />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    {/* Artist Biographies */}
                                                    <div className="mt-6">
                                                        <h3 className="font-bold text-lg text-[#112b38] mb-4">⭕️ ARTIST BIOGRAPHY</h3>
                                                        <div className="space-y-6">
                                                            {artists.map((artist) => (
                                                                <div key={artist.name} className="flex gap-4 items-start bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                                    <img
                                                                        src={artist.img}
                                                                        alt={artist.name}
                                                                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#c89c6b]"
                                                                    />
                                                                    <div>
                                                                        <h4 className="font-bold text-[#112b38] text-base">{artist.name}</h4>
                                                                        <p className="text-xs text-[#c89c6b] font-semibold mb-1">{artist.role}</p>
                                                                        <p className="text-sm text-gray-600 leading-relaxed">{artist.bio}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Ticket Pricing */}
                                                    <div className="mt-6">
                                                        <h3 className="font-bold text-lg text-[#112b38] mb-3">🎟 TICKET PRICING</h3>
                                                        <div className="space-y-3">
                                                            {event.tickets.map((ticket) => (
                                                                <div key={ticket.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                                                                    <div>
                                                                        <span className="font-bold text-[#112b38] text-sm">{ticket.name}</span>
                                                                        <p className="text-xs text-gray-500 mt-0.5">{ticket.description}</p>
                                                                    </div>
                                                                    <span className="font-bold text-[#c89c6b] text-base">Rs {ticket.price.toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* More Info Section */}
                                <div ref={moreInfoRef} id="moreInfo-section">
                                    <div className="bg-white border-t border-b border-gray-200 mt-4">
                                        {/* Collapsible Header */}
                                        <button
                                            onClick={() => setIsMoreInfoCollapsed(!isMoreInfoCollapsed)}
                                            className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isMoreInfoCollapsed ? '-rotate-90' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                <h2 className="text-xl sm:text-2xl font-bold text-[#112b38]">{t.moreInformation}</h2>
                                            </div>
                                        </button>

                                        {!isMoreInfoCollapsed && (
                                            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                                <div className="space-y-6 text-sm sm:text-base text-[#112b38]">

                                                    {/* Warning */}
                                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                        <h3 className="font-bold text-base mb-3 text-amber-700">⚠ WARNING</h3>
                                                        <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
                                                            <li>This is a LIMITED capacity event — do not wait to buy your tickets.</li>
                                                            <li>LIMITED PARKING. We request you to book a taxi, driver, or car-pool to avoid traffic and parking issues.</li>
                                                            <li>This is an 18+ event. Minors will not be allowed unless accompanied by a parent or responsible party.</li>
                                                            <li>By attending you accept to be photographed and filmed by our crew.</li>
                                                            <li>You are not allowed to bring food or drinks inside the venue premises.</li>
                                                            <li>Tickets once bought are NOT refundable.</li>
                                                            <li>The event organiser shall not be held liable for cancellation or disruption due to force majeure events.</li>
                                                        </ul>
                                                    </div>

                                                    {/* Terms & Conditions */}
                                                    <div>
                                                        <h3 className="font-bold text-lg mb-3">{t.ageRestriction} & Terms</h3>
                                                        <ul className="space-y-2 list-disc list-inside text-gray-700 text-sm">
                                                            <li>The Event starts at 15:00 and ends at 23:30. Doors open at 15:00 and close at 17:00.</li>
                                                            <li>This is strictly an 18+ event.</li>
                                                            <li>Food & drinks from outside will not be permitted.</li>
                                                            <li>The organiser reserves the right to amend the venue in case of unforeseeable circumstances.</li>
                                                            <li>Photography and filming is prohibited during the show.</li>
                                                            <li>No Show: If customer does not attend, 100% Cancellation Fee applies.</li>
                                                            <li>No cancellation or exchange available once ticket is confirmed and issued.</li>
                                                            <li>Security checks of bags will be conducted.</li>
                                                            <li>Failure to present your ticket at the event will entitle the organiser to deny access.</li>
                                                            <li>You can print your e-ticket or have it ready to scan from your smartphone. Make sure the QR code and booking ref is visible.</li>
                                                        </ul>
                                                    </div>

                                                    {/* Lockdown & Cyclone Protocol */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                            <h3 className="font-bold text-base mb-2 text-blue-800">🔒 Lockdown Protocol</h3>
                                                            <p className="text-sm text-gray-600 mb-2">If an event coincides with a lockdown or government-imposed restrictions, it may be cancelled or postponed.</p>
                                                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                                                <li><strong>Postponement:</strong> Tickets remain valid for the rescheduled date.</li>
                                                                <li><strong>Cancellation:</strong> A full refund will be provided per cancellation terms.</li>
                                                            </ul>
                                                        </div>
                                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                                            <h3 className="font-bold text-base mb-2 text-blue-800">🌀 Cyclone Protocol</h3>
                                                            <p className="text-sm text-gray-600 mb-2">If a booking falls under Cyclone Class 2 or higher, the event may be postponed or cancelled.</p>
                                                            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                                                <li><strong>Postponement:</strong> Tickets remain valid for the rescheduled date.</li>
                                                                <li><strong>Cancellation:</strong> A full refund will be provided per cancellation terms.</li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    {/* Contact */}
                                                    <div className="text-sm text-gray-600 border-t border-gray-100 pt-4">
                                                        If you have any queries, contact our customer hotline or chat with us via WhatsApp.
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                            <div className="max-w-lg mx-auto bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100/40">
                                {/* Date and Time Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                        <span className="font-medium whitespace-nowrap">Sat 18 Oct</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                        <span className="whitespace-nowrap">{t.doors}: 20:00</span>
                                        <span className="whitespace-nowrap">{t.start}: 20:00</span>
                                    </div>
                                </div>

                                {/* Countdown Timer Section */}
                                <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 rounded-lg p-3 mt-3 sm:mt-4 gap-3 sm:gap-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                                            <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-semibold text-xs sm:text-sm whitespace-nowrap">{t.buyNow}</p>
                                            <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{t.saleEndsIn}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 sm:gap-3 text-center">
                                        {[
                                            { value: "03", label: t.days },
                                            { value: "22", label: t.hours },
                                            { value: "56", label: t.mins },
                                            { value: "17", label: t.seconds },
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <p className="text-base sm:text-lg font-bold text-gray-800">{item.value}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total Amount and Book Now Button */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-5">
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{t.totalAmount}</p>
                                        <p className="text-lg sm:text-xl font-bold text-red-500 whitespace-nowrap">Rs {calculateTotal().toLocaleString()}</p>
                                    </div>
                                    <button className="w-full sm:w-auto bg-[#c89c6b] hover:bg-[#b8885a] text-white font-semibold px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap">
                                        {t.bookNow}
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
                                    <button className="flex items-center gap-1 sm:gap-1.5 hover:text-[#112b38] transition-all duration-300 text-xs sm:text-sm text-gray-600">
                                        <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">{t.addToCalendar}</span>
                                        <span className="whitespace-nowrap sm:hidden">Calendar</span>
                                    </button>
                                    <button className="flex items-center gap-1 sm:gap-1.5 hover:text-[#112b38] transition-all duration-300 text-xs sm:text-sm text-gray-600">
                                        <FaShareAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">{t.shareEvent}</span>
                                        <span className="whitespace-nowrap sm:hidden">Share</span>
                                    </button>
                                  
                                </div>
                            </div>

                            {/* Related Events - Song Player */}
                            {mockSongs.map((song) => (
                                <div key={song.id} className="relative mx-auto bg-white rounded-xl shadow-sm px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between overflow-hidden gap-2 sm:gap-0">
                                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                            <img
                                                src={song.image}
                                                alt={song.artist}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
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
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">{song.artist}</p>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">{song.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                        <button className="text-gray-400 hover:text-[#112b38] hover:scale-110 transition-all duration-300">
                                            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                            onClick={() => togglePlay(song)}
                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#112b38] flex items-center justify-center hover:bg-[#c89c6b] transition-all duration-300 hover:scale-110"
                                        >
                                            {playingSongId === song.id
                                                ? <Pause className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                : <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
                            <div className="bg-gray-200 rounded-xl p-6 sm:p-8 lg:p-12 shadow-md border border-gray-300 flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[570px]">
                                <div className="text-center">
                                    <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-400 mb-2">{t.ads}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">{t.advertisementSpace}</div>
                                </div>
                            </div>

                            {/* Portrait Image */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Artist Slider & Portrait Section */}
            <div className="w-full bg-[#112b38]">
                <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <span className="block text-[#c89c6b] text-xs font-bold uppercase tracking-widest mb-4">Performers</span>

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
                                            border: i === artistCarouselIndex ? '1px solid rgba(200,156,107,0.35)' : '1px solid rgba(17,43,56,0.12)',
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
                                                <div className="absolute bottom-0 left-0 h-[4px] z-20 w-full" style={{ background: 'rgba(200,156,107,0.25)' }} />
                                                <div className="absolute bottom-0 left-0 h-[4px] z-20" style={{ width: `${artistProgress}%`, background: '#c89c6b', transition: 'width 0.05s linear' }} />
                                            </>
                                        )}
                                        {/* Overlay */}
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: 'linear-gradient(0deg, rgba(17,43,56,0.82) 20%, rgba(17,43,56,0.25) 60%, transparent 100%)' }}
                                        />
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h2 className="text-white font-extrabold text-base mb-0.5 leading-tight">{artist.name}</h2>
                                            <span className="text-[#c89c6b] text-xs font-bold block mb-2">{artist.role}</span>
                                            {i === artistCarouselIndex && (
                                                <p className="text-white/70 text-[11px] leading-snug line-clamp-2 mb-2">{artist.bio}</p>
                                            )}
                                            {/* Social icons */}
                                            <div className="flex gap-2 flex-wrap">
                                                {artist.socials.instagram && <a href={artist.socials.instagram} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer"><FaInstagram className="w-5 h-5 text-[#c89c6b] hover:text-white transition-colors" /></a>}
                                                {artist.socials.facebook && <a href={artist.socials.facebook} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer"><FaFacebook className="w-5 h-5 text-[#c89c6b] hover:text-white transition-colors" /></a>}
                                                {artist.socials.tiktok && <a href={artist.socials.tiktok} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="text-[#c89c6b] hover:text-white transition-colors text-sm font-bold">TT</a>}
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
                                    className="w-10 h-10 rounded-full border border-[#c89c6b]/30 bg-[#c89c6b]/10 hover:bg-[#c89c6b]/20 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                                >
                                    <ChevronLeft className="w-5 h-5 text-[#c89c6b]" />
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
                                                background: i === artistRealIndex ? '#c89c6b' : 'rgba(200,156,107,0.2)',
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setArtistCarouselIndex(p => p + 1)}
                                    className="w-10 h-10 rounded-full border border-[#c89c6b]/30 bg-[#c89c6b]/10 hover:bg-[#c89c6b]/20 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                                >
                                    <ChevronRight className="w-5 h-5 text-[#c89c6b]" />
                                </button>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Artist Modal */}
            {selectedArtist && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-[#112b38]/75 backdrop-blur-md px-4"
                    onClick={() => setSelectedArtist(null)}
                >
                    <div
                        className="relative bg-[#112b38] rounded-3xl overflow-hidden max-w-lg w-full shadow-[0_32px_64px_rgba(17,43,56,0.8)] border border-[#c89c6b]/20"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="relative h-80 w-full">
                            <img src={selectedArtist.img} alt={selectedArtist.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #112b38 0%, rgba(17,43,56,0.5) 60%, transparent 100%)' }} />
                            <div className="absolute bottom-5 left-6">
                                <h2 className="text-white font-extrabold text-2xl leading-tight mb-1">{selectedArtist.name}</h2>
                                <span className="text-[#c89c6b] text-sm font-semibold tracking-wide uppercase">{selectedArtist.role}</span>
                            </div>
                        </div>
                        {/* Bio */}
                        <div className="px-6 pt-4 pb-5">
                            {selectedArtist.bio && <p className="text-white/70 text-sm leading-relaxed mb-5">{selectedArtist.bio}</p>}
                            {Object.values(selectedArtist.socials).some(Boolean) && (
                                <>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Socials</p>
                                    <div className="flex gap-4">
                                        {selectedArtist.socials.instagram && <a href={selectedArtist.socials.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="w-6 h-6 text-[#c89c6b] hover:text-[#112b38] transition-colors" /></a>}
                                        {selectedArtist.socials.facebook && <a href={selectedArtist.socials.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook className="w-6 h-6 text-[#c89c6b] hover:text-[#112b38] transition-colors" /></a>}
                                        {selectedArtist.socials.tiktok && <a href={selectedArtist.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#c89c6b] hover:text-[#112b38] transition-colors text-[11px] font-bold self-center border border-[#c89c6b]/30 px-2 py-0.5 rounded">TT</a>}
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
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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