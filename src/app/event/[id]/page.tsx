'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar, MapPin, Clock, Share2, Heart, Bell,
    ChevronLeft, ChevronRight, User, Shield, CreditCard,
    Zap, Ticket as TicketIcon, Check, Info,
    HeartCrack,
    Ticket
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram, FaGreaterThan } from 'react-icons/fa';
import TicketHeroSection from '@/components/event/ticketHeroSection';
import { Text } from 'rizzui/typography';
import { Footer } from '@/components/home';
import { useLanguage } from '@/context/LanguageContext';
import EventCard from '@/components/event/eventCard';

interface EventDetailProps {
    params: {
        id: string;
    };
}

export default function EventDetailPage({ params }: EventDetailProps) {
    const { t }: any = useLanguage();
    const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'tickets' | 'description' | 'moreInfo'>('tickets');

    // Mock event data - Replace with actual API call based on params.id
    const event = {
        id: params.id,
        title: "Star for Mental Health",
        subtitle: "ISSA NOEL KAREEMA OKAYLA BEN",
        date: "28 JAN",
        fullDate: "Tuesday, 28 Jan 2025 at 06:00 pm",
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
                description: "Standing area access"
            },
            {
                id: 2,
                name: "VIP Package",
                price: 5000,
                available: 12,
                description: "Front row seating + Meet & Greet"
            },
            {
                id: 3,
                name: "Premium Table",
                price: 15000,
                available: 3,
                description: "Table for 4 + Bottle service"
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

    return (
        <>
            <div className="relative min-h-screen bg-gray-50">
                {/* Background image - Top section only (approx 135vh) */}
                <div
                    className="absolute top-0 left-0 right-0 h-[135vh] bg-top bg-no-repeat scale-105 blur-sm z-0"
                    style={{ backgroundImage: "url('/Cover%20-/59069_upload68daa2739f40c_1759158899-0-en1759158912.jpg.jpeg')", backgroundSize: '100% auto' }}
                />
                {/* Hero Section with Event Card Design */}
                <div className="relative z-10 w-full overflow-visible flex flex-col justify-end">
                    {/* Content wrapper */}
                    <div className="w-full pt-32 pb-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-center items-center">
                                {/* Event Card */}
                                <div className="w-full h-auto event-card group relative overflow-visible">

                                    {/* Badge Image at Top Left - matches home screen event card badge style */}
                                    <div className="hidden sm:block absolute -top-[57px] -left-[115px] w-[820px] h-auto z-50 pointer-events-none">
                                        <img
                                            src={`/images/LOGO TAG/1.png`}
                                            alt="Event Badge"
                                            className="w-full h-auto object-contain scale-110"
                                        />
                                    </div>
                                    {/* Main Content */}
                                    <div className="relative z-10 overflow-hidden">
                                        {/* Event Image */}
                                        <TicketHeroSection />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-[89%] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 pb-6 sm:pb-8 md:pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Event Info Bar - Horizontal Layout */}
                            <div className="bg-[#f6f6f6] rounded-xl p-4 sm:p-6 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.08)]">
                                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                                    {/* Left - Event Logo/Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#112b38] rounded-lg flex items-center justify-center">
                                            <img
                                                src="/images/LOGO TAG/1.png"
                                                alt={event.organizer}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Middle - Event Details */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#112b38] mb-2">
                                            {event.title}
                                        </h2>
                                        <Text className="text-sm sm:text-base text-[#c89c6b] mb-3">
                                            {t.by} {event.organizer}
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-[#c89c6b] leading-relaxed line-clamp-2">
                                            {event.description}
                                        </Text>
                                    </div>

                                    {/* Right - Time, Location, Price & Countdown */}
                                    <div className="flex-shrink-0 lg:w-[280px] xl:w-[320px]">
                                        <div className="space-y-3">
                                            {/* Time */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-[#112b38] flex-shrink-0" />
                                                <span className="text-[#c89c6b]">{event.fullDate}</span>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-[#112b38] flex-shrink-0" />
                                                <span className="text-[#c89c6b]">{event.location}</span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <TicketIcon className="w-4 h-4 text-[#112b38] flex-shrink-0" />
                                                <span className="text-[#c89c6b]">{t.from} <span className="font-bold text-[#112b38]">Rs 1,000</span></span>
                                            </div>

                                            {/* Countdown Timer */}
                                            <div className="flex gap-2 mt-4 ">
                                                <div className='flex flex-col items-center justify-center'>

                                                    <div className="flex-1 bg-[#D24428] w-14 rounded p-1 text-center shadow-sm">
                                                        <div className="text-2xl sm:text-3xl font-bold text-white leading-none">5</div>
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs text-[#112b38] font-medium">{t.days}</div>
                                                </div>

                                                <div className='flex flex-col items-center justify-center'>

                                                    <div className="flex-1 bg-[#D24428] w-14 rounded p-1 text-center shadow-sm">
                                                        <div className="text-2xl sm:text-3xl font-bold text-white leading-none">19</div>
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs text-[#112b38] font-medium">{t.hours}</div>
                                                </div>

                                                <div className='flex flex-col items-center justify-center'>

                                                    <div className="flex-1 bg-[#D24428] w-14 rounded p-1 text-center shadow-sm">
                                                        <div className="text-2xl sm:text-3xl font-bold text-white leading-none">55</div>
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs text-[#112b38] font-medium">{t.minutes}</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                <div className="flex items-center gap-4 sm:gap-8 px-4 sm:px-6 overflow-x-auto w-full sm:w-auto">
                                    <button
                                        onClick={() => setActiveTab('tickets')}
                                        className={`py-2 text-sm sm:text-base font-bold relative transition-colors ${activeTab === 'tickets'
                                            ? 'text-[#112b38]'
                                            : 'text-gray-400 hover:text-[#c89c6b]'
                                            }`}
                                    >
                                        {t.tickets}
                                        {activeTab === 'tickets' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-t"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`py-2 text-sm sm:text-base relative transition-colors ${activeTab === 'description'
                                            ? 'text-[#112b38]'
                                            : 'text-gray-400 hover:text-[#c89c6b]'
                                            }`}
                                    >
                                        {t.description}
                                        {activeTab === 'description' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#112b38] rounded-t"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('moreInfo')}
                                        className={`py-2 text-sm sm:text-base font-bold relative transition-colors ${activeTab === 'moreInfo'
                                            ? 'text-[#112b38]'
                                            : 'text-gray-400 hover:text-[#c89c6b]'
                                            }`}
                                    >
                                        {t.moreInfo}
                                        {activeTab === 'moreInfo' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#112b38] rounded-t"></div>
                                        )}
                                    </button>
                                </div>
                                <div className='flex gap-2 items-center px-4 sm:px-6 pb-2 sm:pb-0'>
                                    <HeartCrack />
                                    <Text>{t.addToFavourites}</Text>
                                </div>
                            </div>

                            {/* Ticket Selection */}
                            {activeTab === 'tickets' && (
                                <div className="p-4 sm:p-6 ">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#112b38]">{t.chooseYourTickets}</h2>
                                    <div className="space-y-4">
                                        {event.tickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className="bg-gray-100 rounded-lg px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                                            >
                                                <Text className="font-bold text-sm text-[#112b38] min-w-[100px]">{ticket.name}</Text>

                                                <div className="font-bold text-lg text-[#112b38]">Rs{ticket.price.toLocaleString()}</div>

                                                <div className="text-[#c89c6b] font-semibold text-sm flex-1">
                                                    {t.offerEndsIn} 8 {t.days.toLowerCase()}
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button className="w-6 h-6 rounded-full bg-[#112b38] flex items-center justify-center hover:bg-[#c89c6b] hover:scale-110 transition-all duration-300">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    </button>

                                                    <div className="flex items-center gap-2">
                                                        <button className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-[#112b38] hover:text-white hover:border-[#112b38] transition-all duration-300 text-gray-700 font-bold text-base">
                                                            -
                                                        </button>
                                                        <div className="w-12 text-center font-semibold text-lg">
                                                            0
                                                        </div>
                                                        <button className="w-6 h-6 border-2 border-[#c89c6b] text-[#c89c6b] rounded flex items-center justify-center hover:bg-[#c89c6b] hover:text-white transition-all duration-300 font-bold text-base">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedTicket && (
                                        <button className="w-full mt-6 bg-[#112b38] hover:bg-[#c89c6b] text-white py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                                            {t.bookNow}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div className="bg-white rounded-b-xl p-4 sm:p-6 shadow-md border border-t-0 border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">{t.eventDescription}</h2>
                                    <div className="prose max-w-none text-[#c89c6b] text-sm sm:text-base">
                                        <Text>{event.description}</Text>
                                        <Text className="mt-4">Join us for an unforgettable experience at {event.title}. This event promises to be one of the most exciting gatherings of the year.</Text>
                                    </div>
                                </div>
                            )}

                            {/* More Info Tab */}
                            {activeTab === 'moreInfo' && (
                                <div className="bg-white rounded-b-xl p-4 sm:p-6 shadow-md border border-t-0 border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">{t.moreInformation}</h2>
                                    <div className="space-y-4 text-sm sm:text-base text-[#c89c6b]">
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
                            )}

                            {/* Location Map */}
                            <div className="">
                                <div className="space-y-4 ">
                                    <div className="flex items-start gap-3 bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
                                        <div className='flex flex-col items-center justify-center  px-2 rounded-lg shadow-md'>
                                            <MapPin className="w-5 h-5 text-[#c89c6b] flex-shrink-0 mt-1" />
                                            <div className="font-semibold text-sm sm:text-base">{event.location}</div>
                                            <div className="text-xs sm:text-sm text-[#c89c6b]">{t.location}</div>
                                        </div>
                                        <div>
                                            <Text>
                                                Etihad Park
                                            </Text>
                                            <Text>
                                                {event.fullAddress}
                                            </Text>
                                            <Text className='flex gap-2 items-center '>{t.viewDirection} <FaGreaterThan /></Text>
                                        </div>
                                    </div>
                                    <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] bg-gray-200 rounded-xl overflow-hidden">
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
                                <div className="relative w-full h-[250px] sm:h-[300px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src='/images/mapImage.png'
                                        className='w-full h-full'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6 ">
                            {/* Share on Social */}
                            <div className="max-w-lg mx-auto bg-white rounded-xl p-6 shadow-lg border border-gray-100">

                                {/* Top row */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">📅</span>
                                        <span className="font-medium">Sat 18 Oct</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">🕒</span>
                                        <span>{t.doors}: 20:00</span>
                                        <span>{t.start}: 20:00</span>
                                    </div>
                                </div>

                                {/* Divider */}

                                {/* Sale + Countdown */}
                                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                            ⏱
                                        </div>
                                        <div>
                                            <p className="text-blue-600 font-semibold">{t.buyNow}</p>
                                            <p className="text-xs text-gray-500">{t.saleEndsIn}</p>
                                        </div>
                                    </div>

                                    {/* Countdown */}
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

                                {/* Total + Button */}
                                <div className="flex items-center justify-between mt-6">
                                    <div>
                                        <p className="text-sm text-gray-500">{t.totalAmount}</p>
                                        <p className="text-xl font-bold text-red-500">Rs 0</p>
                                    </div>

                                    <button className="bg-[#c89c6b] hover:bg-[#b8885a] text-white font-semibold px-4 py-1.5 rounded-md transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                                        {t.bookNow}
                                    </button>
                                </div>

                                {/* Bottom actions */}
                                <div className="flex justify-center gap-10 mt-6 text-sm text-gray-600">
                                    <button className="flex items-center gap-2 hover:text-[#c89c6b] transition-all duration-300">
                                        📅 {t.addToCalendar}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-[#c89c6b] transition-all duration-300">
                                        🔗 {t.shareEvent}
                                    </button>
                                </div>
                            </div>

                            {/* Related Events */}
                            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between">

                                {/* Left: Image + Text */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop"
                                        alt="Maroon 5"
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-800">Maroon 5</p>
                                        <p className="text-sm text-gray-500">Sugar</p>
                                    </div>
                                </div>

                                {/* Right: Icons */}
                                <div className="flex items-center gap-4">
                                    <button className="text-gray-400 hover:text-[#c89c6b] hover:scale-110 transition-all duration-300">
                                        ❤️
                                    </button>

                                    <button className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#c89c6b] hover:text-white hover:border-[#c89c6b] transition-all duration-300">
                                        ▶
                                    </button>
                                </div>
                            </div>
                            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between">

                                {/* Left: Image + Text */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop"
                                        alt="Maroon 5"
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-800">Maroon 5</p>
                                        <p className="text-sm text-gray-500">Sugar</p>
                                    </div>
                                </div>

                                {/* Right: Icons */}
                                <div className="flex items-center gap-4">
                                    <button className="text-gray-400 hover:text-[#c89c6b] hover:scale-110 transition-all duration-300">
                                        ❤️
                                    </button>

                                    <button className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#c89c6b] hover:text-white hover:border-[#c89c6b] transition-all duration-300">
                                        ▶
                                    </button>
                                </div>
                            </div>
                            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm px-4 py-3 flex items-center justify-between">

                                {/* Left: Image + Text */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop"
                                        alt="Maroon 5"
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-800">Maroon 5</p>
                                        <p className="text-sm text-gray-500">Sugar</p>
                                    </div>
                                </div>

                                {/* Right: Icons */}
                                <div className="flex items-center gap-4">
                                    <button className="text-gray-400 hover:text-[#c89c6b] hover:scale-110 transition-all duration-300">
                                        ❤️
                                    </button>

                                    <button className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#c89c6b] hover:text-white hover:border-[#c89c6b] transition-all duration-300">
                                        ▶
                                    </button>
                                </div>
                            </div>

                            {/* Advertisement */}
                            <div className="bg-gray-200 rounded-xl p-8 sm:p-12 shadow-md border border-gray-300 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                                <div className="text-center">
                                    <div className="text-4xl sm:text-6xl font-bold text-gray-400 mb-2">{t.ads}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">{t.advertisementSpace}</div>
                                </div>
                            </div>

                            {/* Portrait Image */}
                            <div className="relative w-full h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=800&fit=crop"
                                    alt="Portrait Event Image"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-white text-2xl font-bold mb-2">Don't Miss Out</h3>
                                    <p className="text-white/90 text-sm">Experience the night of your life</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Artist Slider & Portrait Section */}
            <div className="w-full sm:w-[85%] mx-auto mt-12 mb-2 px-4 sm:px-0">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Artists Slider */}
                    <div className="flex-1 overflow-visible">
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide pt-2 px-1">
                            {[
                                { name: "Daskill", role: "DJ", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop" },
                                { name: "DJ M'RICK", role: "DJ", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" },
                                { name: "AVLS", role: "Artist", img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop" },
                                { name: "Moon", role: "Performer", img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop" },
                                { name: "Mary Jane", role: "Vocalist", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
                            ].map((artist, i) => (
                                <div key={i} className="relative w-[130px] h-[170px] sm:w-[150px] sm:h-[190px] rounded-xl overflow-hidden flex-shrink-0 shadow-lg group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <Image
                                        src={artist.img}
                                        alt={artist.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end">
                                        <h4 className="text-white font-bold text-sm leading-tight">{artist.name}</h4>
                                        <p className="text-gray-300 text-[10px] uppercase tracking-wider">{artist.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-[85%] mx-auto my-12 px-4 sm:px-0">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.relatedEvents || "Related Events"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14 md:gap-16 lg:gap-20 py-8 overflow-visible justify-items-center">
                    {[
                        {
                            id: 1,
                            title: "EN TOUTE INTIMITÉ",
                            location: "Le Suffren Hotel & Spa",
                            price: "RS 450",
                            image: "https://otayo.com/wp-content/uploads/2026/01/zulu-new-grid.jpg",
                            day: "18",
                            month: "Oct"
                        },
                        {
                            id: 2,
                            title: "Summer Music Festival",
                            location: "Grand Bay",
                            price: "RS 600",
                            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop",
                            day: "19",
                            month: "Oct"
                        },
                        {
                            id: 3,
                            title: "Jazz Night Live",
                            location: "Caudan Waterfront",
                            price: "RS 800",
                            image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&auto=format&fit=crop",
                            day: "24",
                            month: "Oct"
                        }
                    ].map((event, index) => (
                        <Link
                            key={event.id}
                            href={`/event/${event.id}`}
                            className="w-full max-w-[340px] h-auto event-card relative overflow-visible block cursor-pointer"
                        >
                            {/* Badge Image at Top Left */}
                            <div className="hidden sm:block absolute -top-[28px] -left-[59px] w-[420px] h-auto z-50 pointer-events-none">
                                <img
                                    src={`/images/LOGO TAG/${index + 1}.png`}
                                    alt="Badge"
                                    className="w-full h-auto object-contain scale-110"
                                />
                            </div>

                            {/* Main Content */}
                            <div className="relative z-10 overflow-hidden rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-xl bg-white">
                                {/* Event Image */}
                                <div className="relative w-full h-[340px] overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />

                                    {/* Date Badge */}
                                    <div className="absolute top-3 right-3 bg-black/70 rounded shadow-lg overflow-hidden z-20 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="text-lg sm:text-xl font-bold text-white leading-none">{event.day}</div>
                                            <div className="text-sm sm:text-base font-bold text-white uppercase">{event.month}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="w-full bg-white flex items-stretch justify-between border border-[#7e7b7b] border-t-0 rounded-bl-2xl rounded-br-lg overflow-hidden">
                                    <div className='flex flex-col justify-center pl-3 sm:pl-4 py-2 sm:py-3'>
                                        <p className="text-xs sm:text-sm font-bold whitespace-nowrap text-gray-900">{event.title}</p>
                                        <p className="text-[10px] sm:text-xs text-[#112b38]">{event.location}</p>
                                    </div>
                                    <div className='w-[135px] bg-[#112b38] hover:bg-[#c89c6b] flex-shrink-0 flex flex-col items-center justify-center py-2 sm:py-3 px-4 sm:px-6 text-white rounded-bl-3xl transition-colors duration-300 relative z-10'>
                                        <p className="mr-1 sm:mr-2 text-[8px] sm:text-[9.9px]">{t.asFrom}</p>
                                        <p className="text-xs sm:text-[15.9px]">{event.price}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>

    );
}
