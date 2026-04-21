'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import AuthModal from '@/components/AuthModal';
import { getImageUrl as getImageUrlUtil } from '@/lib/imageUrl';
import api from '@/lib/api';
import { useCms } from '@/lib/useCms';

interface EventDetailProps {
    params: {
        id: string;
    };
}

// NOTE: artists and songs come from the API — no static artist constants

// Fallback slides used when API event has no slides of its own
const slides = [
    {
        id: 1,
        type: "image",
        url: "/Cover%20-/59069_upload68daa2739f40c_1759158899-0-en1759158912.jpg.jpeg",
        alt: "Event Cover",
        duration: 6,
    },
    {
        id: 2,
        type: "video",
        url: "/22193_398acba9ebf32f60d280ccecab409d04-1-en1772118332.mp4",
        alt: "Event Video 1",
        bgImage: "/Cover%20-/59069_upload68daa2739f40c_1759158899-0-en1759158912.jpg.jpeg",
        duration: 6,
    },
    {
        id: 3,
        type: "image",
        url: "/Cover%20-/rishab_rikhiram_sharma_3764-orig1758879457.jpeg",
        alt: "Rishab Rikhiram Sharma",
        duration: 6,
    },
    {
        id: 4,
        type: "video",
        url: "/21971_cb42a1d4c3a2dd327fcce42ba642f04c-1-en1771248482.mp4",
        alt: "Event Video 2",
        bgImage: "/Cover%20-/59069_upload68daa2739f40c_1759158899-0-en1759158912.jpg.jpeg",
        duration: 6,
    },
    {
        id: 5,
        type: "image",
        url: "/Cover%20-/65370_upload6982ed73b2de6_1770188147-0-en1770188167.jpg.jpeg",
        alt: "Event Cover 3",
        duration: 6,
    },
];

export default function EventDetailPage({ params }: EventDetailProps) {
    const { t, language }: any = useLanguage();
    const router = useRouter();
    // CMS section visibility config for the event detail page
    const { content: cmsEventConfig } = useCms('event');
    const isSectionVisible = (key: string) => {
        const vis = cmsEventConfig[key]?.isVisible;
        return vis === undefined || vis === null || Boolean(vis);
    };
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'tickets' | 'description' | 'moreInfo'>('tickets');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [playingSongId, setPlayingSongId] = useState<number | null>(null);
    const [songProgress, setSongProgress] = useState<{ [key: number]: number }>({});
    const [relatedCarouselIndex, setRelatedCarouselIndex] = useState(0);
    const [apiEvent, setApiEvent] = useState<any>(null);
    const [apiLoading, setApiLoading] = useState(true);

    // Collapse states for each section
    const [isTicketsCollapsed, setIsTicketsCollapsed] = useState(false);
    const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
    const [isMoreInfoCollapsed, setIsMoreInfoCollapsed] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // State for ticket quantities - Initialize properly
    const [ticketQuantities, setTicketQuantities] = useState<{ [key: number]: number }>({});
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
    const [artistCarouselIndex, setArtistCarouselIndex] = useState(3); // reset when artists load
    const [artistProgress, setArtistProgress] = useState(0);
    const [artistNoTransition, setArtistNoTransition] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState<any>(null);
    const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
    const cardsPerPage = 3;

    // Refs for each section
    const ticketsRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const moreInfoRef = useRef<HTMLDivElement>(null);
    const tabContentRef = useRef<HTMLDivElement>(null);

    // Fetch real event data from API
    useEffect(() => {
        api.get(`/events/${params.id}`)
            .then(res => setApiEvent(res.data.data?.event ?? res.data.event ?? res.data))
            .catch(() => { })
            .finally(() => setApiLoading(false));
    }, [params.id]);

    // Reset artist carousel index when displayArtists changes (API data loads)
    // NOTE: displayArtists is computed below from apiEvent — this effect runs after render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const len = apiEvent?.artists?.length ?? 0;
        if (len > 0) setArtistCarouselIndex(Math.min(3, len));
    }, [apiEvent?.artists?.length]);

    // Fetch related events (same category, excluding current)
    useEffect(() => {
        if (!apiEvent?.category) return;
        api.get('/events', { params: { category: apiEvent.category, limit: 7 } })
            .then(res => {
                const list = res.data.data?.events ?? res.data.events ?? [];
                setRelatedEvents(list.filter((e: any) => String(e.id) !== String(params.id)).slice(0, 6));
            })
            .catch(() => { });
    }, [apiEvent?.category]);

    // Socket.IO — join event room & listen for real-time ticket updates
    useEffect(() => {
        import('@/lib/socket').then(({ getSocket }) => {
            const socket = getSocket();
            socket.emit('join:event', params.id);
            const handler = (data: { eventId: string; ticketTypes: any[] }) => {
                if (String(data.eventId) === String(params.id)) {
                    setApiEvent((prev: any) => prev ? { ...prev, ticketTypes: data.ticketTypes } : prev);
                }
            };
            socket.on('ticket:updated', handler);
            return () => {
                socket.emit('leave:event', params.id);
                socket.off('ticket:updated', handler);
            };
        });
    }, [params.id]);

    const getLang = (field: { en?: string; fr?: string } | undefined) =>
        field ? (language === 'fr' ? (field.fr || field.en || '') : (field.en || field.fr || '')) : '';

    const getImageUrl = (path: string | undefined) => getImageUrlUtil(path);

    // ── Dynamic artists from API ──────────────────────────────────────────
    const displayArtists: any[] = apiEvent?.artists?.length ? apiEvent.artists : [];
    const ARTIST_CLONE = Math.min(3, displayArtists.length);
    const artistsExtended = displayArtists.length > 0
        ? [...displayArtists.slice(-ARTIST_CLONE), ...displayArtists, ...displayArtists.slice(0, ARTIST_CLONE)]
        : [];

    // ── Songs from API (hide section if none) ─────────────────────────────
    const mockSongs: any[] = apiEvent?.songs ?? [];

    // ── Merge API data over mock fallbacks ────────────────────────────────
    const event = {
        id: params.id,
        title: apiEvent ? getLang(apiEvent.title) : "Star for Mental Health",
        subtitle: apiEvent ? getLang(apiEvent.description)?.slice(0, 60) : "ISSA NOEL KAREEMA OKAYLA BEN",
        date: apiEvent ? new Date(apiEvent.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase() : "28 JAN",
        startDate: apiEvent?.startDate ?? "2026-04-29T18:00:00",
        fullDate: apiEvent ? new Date(apiEvent.startDate).toLocaleString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }) + (apiEvent.startTime ? ` at ${apiEvent.startTime}` : '') : "Tuesday, 29 Apr 2026 at 06:00 pm",
        endDate: apiEvent?.endTime ?? "11:59 pm",
        location: apiEvent ? getLang(apiEvent.venue) : "Venue",
        fullAddress: apiEvent ? getLang(apiEvent.address) : "123A University Street, Dubai, UAE",
        organizer: apiEvent?.createdBy?.name ?? "Platinum List",
        images: apiEvent?.slides?.length
            ? apiEvent.slides.map((s: any) => getImageUrl(s.url))
            : apiEvent?.coverImage
                ? [getImageUrl(apiEvent.coverImage)]
                : ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop"],
        description: apiEvent ? getLang(apiEvent.description) : "Join us for an unforgettable evening dedicated to raising awareness and support for mental health initiatives.",
        lineup: [],
        tickets: apiEvent?.ticketTypes?.length
            ? apiEvent.ticketTypes.map((tt: any, i: number) => {
                const daysLeft = tt.expiryDate
                    ? Math.max(0, Math.ceil((new Date(tt.expiryDate).getTime() - Date.now()) / 86400000))
                    : null;
                const offerEndsIn = tt.expiryDate
                    ? (daysLeft !== null && daysLeft > 0 ? `Offer ends in` : 'Offer expired')
                    : '';
                return {
                    id: i + 1,
                    name: getLang(tt.name),
                    price: tt.price,
                    available: tt.availableSeats ?? tt.totalSeats ?? 0,
                    totalSeats: tt.totalSeats ?? 0,
                    description: getLang(tt.description),
                    offerEndsIn,
                    daysLeft,
                    days: 'Days',
                };
            })
            : [],
        relatedEvents: []
    };

    // Build slides dynamically from real event data
    const dynamicSlides = React.useMemo(() => {
        if (!apiEvent) return null; // still loading
        const coverUrl = apiEvent.coverImage ? getImageUrl(apiEvent.coverImage) : null;
        const built: { id: number; type: string; url: string; alt: string; bgImage?: string; duration: number }[] = [];

        // Slide 1: event's own coverImage
        built.push({
            id: 1,
            type: 'image',
            url: coverUrl ?? slides[0].url,
            alt: getLang(apiEvent.title) || 'Event Cover',
            duration: 6,
        });

        // Slides 2+: if event has its own slides array use those, otherwise fall back to the static slides (skip index 0)
        const extraFromApi = Array.isArray(apiEvent.slides) && apiEvent.slides.length > 0;
        if (extraFromApi) {
            apiEvent.slides.forEach((s: any, i: number) => {
                const url = getImageUrl(s.url || s);
                const isVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
                built.push({
                    id: i + 2,
                    type: isVideo ? 'video' : 'image',
                    url,
                    alt: s.alt || `Slide ${i + 2}`,
                    bgImage: isVideo ? (coverUrl ?? url) : undefined,
                    duration: 6,
                });
            });
        } else {
            // Use ALL static slides after the coverImage so nothing is skipped
            slides.forEach((s, i) => {
                built.push({
                    ...s,
                    id: i + 2,
                    // For video slides, replace bgImage with the event's coverImage
                    bgImage: s.type === 'video' ? (coverUrl ?? s.bgImage) : undefined,
                });
            });
        }

        return built;
    }, [apiEvent]);

    // Use dynamic slides once loaded, otherwise keep a placeholder
    const activeSlides = dynamicSlides ?? slides;
    const safeCurrentSlide = Math.min(currentSlide, activeSlides.length - 1);
    const currentSlideData = activeSlides[safeCurrentSlide];

    // Reset to slide 0 when event data loads (new slides array)
    useEffect(() => {
        setCurrentSlide(0);
    }, [dynamicSlides]);
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
        let progress = 0;
        const step = 100 / (6000 / 50);
        const timer = setInterval(() => {
            progress += step;
            if (progress >= 100) {
                clearInterval(timer);
                setArtistProgress(0);
                setArtistCarouselIndex(idx => idx + 1);
            } else {
                setArtistProgress(progress);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [artistCarouselIndex]);

    useEffect(() => {
        if (artistNoTransition) return;
        const min = ARTIST_CLONE;
        const max = ARTIST_CLONE + displayArtists.length - 1;
        if (artistCarouselIndex < min || artistCarouselIndex > max) {
            const t = setTimeout(() => {
                setArtistNoTransition(true);
                const jumpTo = artistCarouselIndex < min
                    ? artistCarouselIndex + displayArtists.length
                    : artistCarouselIndex - displayArtists.length;
                setArtistCarouselIndex(jumpTo);
                requestAnimationFrame(() => requestAnimationFrame(() => setArtistNoTransition(false)));
            }, 510);
            return () => clearTimeout(t);
        }
    }, [artistCarouselIndex, artistNoTransition]);

    // Initialize quantities when tickets load from API
    useEffect(() => {
        if (event.tickets.length === 0) return;
        const initialQuantities: { [key: number]: number } = {};
        event.tickets.forEach((ticket: { id: number }) => {
            initialQuantities[ticket.id] = 0;
        });
        setTicketQuantities(initialQuantities);
    }, [event.tickets.length]);

    // Increment quantity function - capped at min(20, available)
    const incrementQuantity = (ticketId: number, maxAvailable: number) => {
        const cap = Math.min(20, maxAvailable > 0 ? maxAvailable : 20);
        setTicketQuantities(prev => {
            const currentQty = prev[ticketId] || 0;
            const newQty = Math.min(currentQty + 1, cap);
            return { ...prev, [ticketId]: newQty };
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
        return event.tickets.reduce((total: number, ticket: { id: number; price: number }) => {
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
        const steps = Math.max(0, relatedEvents.length - cardsPerPage);
        if (steps === 0) return;
        const timer = setInterval(() => {
            setRelatedCarouselIndex(prev => (prev + 1) % (steps + 1));
        }, 3000);
        return () => clearInterval(timer);
    }, [relatedEvents.length, cardsPerPage]);

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

            {/* Background — blurred event cover image */}
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
                }}
            >
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
                <div
                    className="absolute bottom-0 left-0 right-0 h-[160px]"
                    style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 65%, rgba(255,255,255,0.92) 100%)' }}
                />
            </div>

            <NavSearchHeader />

            {/* Hero Carousel Slider */}
            <TicketHeroSection
                slides={activeSlides}
                currentSlide={safeCurrentSlide}
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
                                                <span className="text-[#c89c6b]">{t.from} <span className="font-bold text-[#c89c6b]">Rs {event.tickets.length ? Math.min(...event.tickets.map((tk: any) => tk.price)).toLocaleString() : '—'}</span></span>
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
                                {isSectionVisible('tickets') ? (
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
                                                    {event.tickets.map((ticket: { id: number; name: string; price: number; available: number; totalSeats?: number; description: string; offerEndsIn: string; daysLeft?: number | null; days: string }) => (
                                                        <div key={ticket.id} className="bg-gray-100 rounded-lg overflow-hidden">
                                                            {/* Main Ticket Row - always horizontal */}
                                                            <div className="px-3 sm:px-4 py-2 flex flex-row items-center gap-3 sm:gap-4">
                                                                {/* Ticket Name */}
                                                                <Text className="font-bold text-xs sm:text-sm text-[#112b38] flex-shrink-0 whitespace-nowrap min-w-[110px] sm:min-w-[140px]">
                                                                    {ticket.name}
                                                                </Text>

                                                                {/* Price */}
                                                                <div className="font-bold text-sm sm:text-lg text-[#112b38] flex-shrink-0 whitespace-nowrap min-w-[70px] sm:min-w-[90px]">
                                                                    Rs{ticket.price.toLocaleString()}
                                                                </div>

                                                                {/* Offer Text - hidden on xs, shown sm+ */}
                                                                <div className="hidden sm:block font-semibold text-sm flex-shrink-0 whitespace-nowrap text-[#c89c6b] hover:text-[#112b38] transition-colors duration-200">
                                                                    {ticket.offerEndsIn}{ticket.offerEndsIn && ticket.daysLeft != null && ticket.daysLeft > 0 ? ` ${ticket.daysLeft} days` : ''}
                                                                </div>
                                                                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                                                                    {/* Accordion Toggle Button */}
                                                                    <button
                                                                        onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                                                                        className="w-6 h-6 rounded-full bg-[#112b38] flex items-center justify-center hover:bg-[#c89c6b] hover:scale-110 transition-all duration-300"
                                                                    >
                                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                                            className={`w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#c89c6b] rounded flex items-center justify-center transition-all duration-300 font-bold text-sm sm:text-base ${ticketQuantities[ticket.id] >= Math.min(20, ticket.available || 20)
                                                                                ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300'
                                                                                : 'text-[#112b38] hover:bg-[#c89c6b] hover:text-white'
                                                                                }`}
                                                                            onClick={() => incrementQuantity(ticket.id, ticket.available)}
                                                                            disabled={ticketQuantities[ticket.id] >= Math.min(20, ticket.available || 20)}
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
                                                                    <p className="text-xs text-[#112b38] mt-2">Only {ticket.available} tickets available (Max {Math.min(20, ticket.available)} per person)</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null} {/* end tickets */}

                                {/* Description Section */}
                                {isSectionVisible('description') ? (
                                    <div ref={descriptionRef} id="description-section">
                                        <div className="bg-white mt-4">
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
                                                                {displayArtists.length === 0 ? (
                                                                    <p className="text-sm text-gray-400">No artist information available.</p>
                                                                ) : displayArtists.map((artist: any) => (
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
                                                                {event.tickets.map((ticket: { id: number; name: string; price: number; description: string }) => (
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
                                ) : null}

                                {/* More Info Section */}
                                {isSectionVisible('moreInfo') ? (
                                    <div ref={moreInfoRef} id="moreInfo-section">
                                        <div className="bg-white mt-4">
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
                                ) : null} {/* end moreInfo */}

                            </div> {/* end tab content */}


                            {/* Location Map */}
                            {isSectionVisible('location') && (
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
                                                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.fullAddress || event.location || 'Mauritius')}&output=embed`}
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
                            )} {/* end location */}

                            {/* Site Plan */}
                            {isSectionVisible('sitePlan') && (
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
                            )} {/* end sitePlan */}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Share on Social */}
                            <div className="max-w-lg mx-auto bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100/40">
                                {/* Date and Time Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-[#c89c6b]">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c89c6b]" />
                                        <span className="font-medium whitespace-nowrap">{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c89c6b] flex-shrink-0" />
                                        {apiEvent?.startTime && <span className="whitespace-nowrap">{t.start}: {apiEvent.startTime}</span>}
                                        {apiEvent?.endTime && <span className="whitespace-nowrap">{t.doors}: {apiEvent.endTime}</span>}
                                    </div>
                                </div>

                                {/* Countdown Timer Section */}
                                <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg p-3 mt-3 sm:mt-4 gap-3 sm:gap-0" style={{ background: 'rgba(200,156,107,0.10)' }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#c89c6b] flex-shrink-0" style={{ background: 'rgba(200,156,107,0.18)' }}>
                                            <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[#c89c6b] font-semibold text-xs sm:text-sm whitespace-nowrap">{t.buyNow}</p>
                                            <p className="text-[10px] sm:text-xs text-[#c89c6b]/70 whitespace-nowrap">{t.saleEndsIn}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 sm:gap-3 text-center">
                                        {[
                                            { value: String(countdown.days).padStart(2, '0'), label: t.days },
                                            { value: String(countdown.hours).padStart(2, '0'), label: t.hours },
                                            { value: String(countdown.minutes).padStart(2, '0'), label: t.mins },
                                        ].map((item, index) => (
                                            <div key={index}>
                                                <p className="text-base sm:text-lg font-bold text-[#112b38]">{item.value}</p>
                                                <p className="text-[10px] sm:text-xs text-[#c89c6b] whitespace-nowrap">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total Amount and Book Now Button */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-4 sm:mt-5">
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm text-[#c89c6b] whitespace-nowrap">{t.totalAmount}</p>
                                        <p className="text-lg sm:text-xl font-bold text-red-500 whitespace-nowrap">Rs {calculateTotal().toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => router.push(`/event/${params.id}/checkout`)}
                                        disabled={calculateTotal() === 0}
                                        className={`w-full sm:w-auto font-semibold px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 shadow-md whitespace-nowrap ${calculateTotal() === 0 ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-[#c89c6b] hover:bg-[#b8885a] text-white hover:scale-105 hover:shadow-lg'}`}
                                    >
                                        {t.bookNow}
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="flex items-center gap-1 sm:gap-1.5 hover:text-[#112b38] transition-all duration-300 text-xs sm:text-sm text-[#c89c6b]"
                                    >
                                        <FaCalendarAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">{t.addToCalendar}</span>
                                        <span className="whitespace-nowrap sm:hidden">Calendar</span>
                                    </button>
                                    <button
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="flex items-center gap-1 sm:gap-1.5 hover:text-[#112b38] transition-all duration-300 text-xs sm:text-sm text-[#c89c6b]"
                                    >
                                        <FaShareAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        <span className="whitespace-nowrap hidden sm:inline">{t.shareEvent}</span>
                                        <span className="whitespace-nowrap sm:hidden">Share</span>
                                    </button>

                                </div>
                            </div>

                            {/* Related Events - Song Player */}
                            {isSectionVisible('songs') && mockSongs.length > 0 && mockSongs.map((song) => (
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
            {isSectionVisible('artists') && (
                <div className="w-full bg-[#112b38]">
                    <div className="max-w-[1230px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <span className="block text-[#c89c6b] text-xs font-bold uppercase tracking-widest mb-4">Performers</span>

                        {displayArtists.length === 0 ? (
                            <p className="text-white/40 text-sm py-4">No performers listed for this event.</p>
                        ) : (
                            <>
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
                                    const artistRealIndex = displayArtists.length > 0
                                        ? (artistCarouselIndex - ARTIST_CLONE + displayArtists.length * 100) % displayArtists.length
                                        : 0;
                                    return (
                                        <div className="flex items-center justify-between mt-5 gap-3">
                                            <button
                                                onClick={() => setArtistCarouselIndex(p => p - 1)}
                                                className="w-10 h-10 rounded-full border border-[#c89c6b]/30 bg-[#c89c6b]/10 hover:bg-[#c89c6b]/20 flex items-center justify-center transition-all shadow-sm flex-shrink-0"
                                            >
                                                <ChevronLeft className="w-5 h-5 text-[#c89c6b]" />
                                            </button>

                                            <div className="flex items-center justify-center gap-1.5 flex-1">
                                                {displayArtists.map((_: any, i: number) => (
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
                            </>
                        )}
                    </div>
                </div>
            )} {/* end artists section visibility */}

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

            {isSectionVisible('relatedEvents') && relatedEvents.length > 0 && (() => {
                const totalSteps = Math.max(0, relatedEvents.length - cardsPerPage);
                return (
                    <div className="w-full sm:w-[85%] mx-auto my-12 px-4 sm:px-0">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{t.relatedEvents || 'Related Events'}</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setRelatedCarouselIndex(prev => (prev - 1 + totalSteps + 1) % (totalSteps + 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#112b38] hover:text-white hover:border-[#112b38] transition-all duration-300">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => setRelatedCarouselIndex(prev => (prev + 1) % (totalSteps + 1))}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#112b38] hover:text-white hover:border-[#112b38] transition-all duration-300">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="relative overflow-hidden">
                            <div className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${relatedCarouselIndex * (100 / cardsPerPage)}%)` }}>
                                {relatedEvents.map((ev: any) => {
                                    const evTitle = language === 'fr' ? (ev.title?.fr || ev.title?.en) : (ev.title?.en || ev.title?.fr);
                                    const evVenue = language === 'fr' ? (ev.venue?.fr || ev.venue?.en) : (ev.venue?.en || ev.venue?.fr);
                                    const evImg = getImageUrl(ev.coverImage);
                                    const evDate = new Date(ev.startDate);
                                    const evDay = String(evDate.getDate()).padStart(2, '0');
                                    const evMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][evDate.getMonth()];
                                    const evMinPrice = ev.ticketTypes?.length ? Math.min(...ev.ticketTypes.map((t: any) => t.price)) : 0;
                                    return (
                                        <div key={ev.id} className="w-1/3 flex-shrink-0 px-5 sm:px-7 py-8 overflow-visible">
                                            <Link href={`/event/${ev.id}`} className="w-full max-w-[340px] h-auto event-card relative overflow-visible block cursor-pointer mx-auto">
                                                <div className="relative z-10 overflow-hidden rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl bg-white">
                                                    <div className="relative w-full h-[340px] overflow-hidden">
                                                        <Image src={evImg} alt={evTitle || 'Event'} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                                                        <div className="absolute top-3 right-3 bg-black/70 rounded shadow-lg overflow-hidden z-20 px-1">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                                                <div className="text-lg sm:text-xl font-bold text-white leading-none">{evDay}</div>
                                                                <div className="text-sm sm:text-base font-bold text-white uppercase">{evMonth}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-white flex items-stretch justify-between border border-[#7e7b7b] border-t-0 rounded-bl-2xl rounded-br-lg overflow-hidden">
                                                        <div className='flex flex-col justify-center pl-3 sm:pl-4 py-2 sm:py-3'>
                                                            <p className="text-xs sm:text-sm font-bold whitespace-nowrap text-gray-900">{evTitle}</p>
                                                            <p className="text-[10px] sm:text-xs text-[#112b38]">{evVenue}</p>
                                                        </div>
                                                        <div className='w-[135px] bg-[#112b38] hover:bg-[#c89c6b] flex-shrink-0 flex flex-col items-center justify-center py-2 sm:py-3 px-4 sm:px-6 text-white rounded-bl-3xl transition-colors duration-300 relative z-10'>
                                                            <p className="mr-1 sm:mr-2 text-[8px] sm:text-[9.9px]">{t.asFrom}</p>
                                                            <p className="text-xs sm:text-[15.9px]">Rs {evMinPrice.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 mt-3">
                            {Array.from({ length: totalSteps + 1 }).map((_, i) => (
                                <button key={i} onClick={() => setRelatedCarouselIndex(i)}
                                    className={`rounded-full transition-all duration-300 ${i === relatedCarouselIndex ? 'w-5 h-2 bg-[#c89c6b]' : 'w-2 h-2 bg-gray-300 hover:bg-[#c89c6b]/60'}`} />
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <Footer />
        </div>
    );
}