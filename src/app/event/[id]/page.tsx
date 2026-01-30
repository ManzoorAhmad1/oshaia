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
import AllEvents from '@/components/event/allEvent';
import TicketHeroSection from '@/components/event/ticketHeroSection';
import { Text } from 'rizzui/typography';
import { Footer } from '@/components/home';

interface EventDetailProps {
    params: {
        id: string;
    };
}

export default function EventDetailPage({ params }: EventDetailProps) {
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
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section with Event Card Design */}
                <div className="relative w-full bg-gradient-to-br from-[#0d5c75] to-[#112b38] py-16 sm:py-20 md:py-24 overflow-visible">
                    {/* Carousel Controls */}


                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center">
                            {/* Event Card */}
                            <div className="w-full h-auto event-card group relative overflow-visible">

                                {/* Badge Image at Top Left - Outside the card */}
                                <div className="absolute -top-[40px] sm:-top-[25px] -left-[30px] sm:-left-[44px] w-[300px] h-auto z-30">
                                    <img
                                        src={`/images/LOGO TAG/1.png`}
                                        alt="Event Badge"
                                        className="w-[150px] sm:w-[180px] md:w-[200px] h-auto object-contain drop-shadow-2xl"
                                    />
                                </div>
                                <div className="absolute -top-[40px] sm:top-[5px] left-[25px] sm:left-[10px] h-auto z-20 bg-[#0D5870] px-8 py-4 rounded-full">
                                    <Text>
                                        Top Seller
                                    </Text>
                                </div>
                                {/* Main Content */}
                                <div className="relative z-10 overflow-hidden ">
                                    {/* Event Image */}
                                    <TicketHeroSection />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Event Info Bar - Horizontal Layout */}
                            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200">
                                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                                    {/* Left - Event Logo/Icon */}
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-black rounded-lg flex items-center justify-center">
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
                                            By {event.organizer}
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
                                                <span className="text-[#c89c6b]">From <span className="font-bold text-[#112b38]">Rs 1,000</span></span>
                                            </div>

                                            {/* Countdown Timer */}
                                            <div className="flex gap-2 mt-4 ">
                                                <div className='flex flex-col items-center justify-center'>

                                                    <div className="flex-1 bg-[#c89c6b] w-14 rounded p-1 text-center">
                                                        <div className="text-2xl sm:text-3xl font-bold text-white leading-none">5</div>
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs text-[#112b38] font-medium">Days</div>
                                                </div>

                                                <div className='flex flex-col items-center justify-center'>

                                                    <div className="flex-1 bg-[#c89c6b] w-14 rounded p-1 text-center">
                                                        <div className="text-2xl sm:text-3xl font-bold text-white leading-none">19</div>
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs text-[#112b38] font-medium">Hours</div>
                                                </div>

                                                <div className='flex flex-col items-center justify-center'>

                                                    <div className="flex-1 bg-[#c89c6b] w-14 rounded p-1 text-center">
                                                        <div className="text-2xl sm:text-3xl font-bold text-white leading-none">55</div>
                                                    </div>
                                                    <div className="text-[11px] sm:text-xs text-[#112b38] font-medium">Minutes</div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="w-full flex items-center justify-between ">
                                <div className="flex items-center gap-8 px-4 sm:px-6">
                                    <button
                                        onClick={() => setActiveTab('tickets')}
                                        className={`py-4 text-base sm:text-lg font-bold relative transition-colors ${activeTab === 'tickets'
                                            ? 'text-[#112b38]'
                                            : 'text-gray-400 hover:text-[#c89c6b]'
                                            }`}
                                    >
                                        Tickets
                                        {activeTab === 'tickets' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-t"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`py-4 text-base sm:text-base relative transition-colors ${activeTab === 'description'
                                            ? 'text-[#112b38]'
                                            : 'text-gray-400 hover:text-[#c89c6b]'
                                            }`}
                                    >
                                        Description
                                        {activeTab === 'description' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-t"></div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('moreInfo')}
                                        className={`py-4 text-base sm:text-lg font-bold relative transition-colors ${activeTab === 'moreInfo'
                                            ? 'text-[#112b38]'
                                            : 'text-gray-400 hover:text-[#c89c6b]'
                                            }`}
                                    >
                                        More info
                                        {activeTab === 'moreInfo' && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-t"></div>
                                        )}
                                    </button>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <HeartCrack />
                                    <Text>Add To Favourites</Text>
                                </div>
                            </div>

                            {/* Ticket Selection */}
                            {activeTab === 'tickets' && (
                                <div className="p-4 sm:p-6 ">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#112b38]">Choose Your Tickets</h2>
                                    <div className="space-y-4">
                                        {event.tickets.map((ticket) => (
                                            <div
                                                key={ticket.id}
                                                className="bg-gray-100 rounded-lg px-4 py-2 flex items-center justify-between gap-4"
                                            >
                                                <Text className="font-bold text-sm text-[#112b38] min-w-[100px]">{ticket.name}</Text>

                                                <div className="font-bold text-lg text-[#112b38]">Rs{ticket.price.toLocaleString()}</div>

                                                <div className="text-[#c89c6b] font-semibold text-sm flex-1">
                                                    Offer ends in 8 days
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                        </svg>
                                                    </button>

                                                    <div className="flex items-center gap-2">
                                                        <button className="w-10 h-10 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700 font-bold text-xl">
                                                            -
                                                        </button>
                                                        <div className="w-12 text-center font-semibold text-lg">
                                                            0
                                                        </div>
                                                        <button className="w-10 h-10 border-2 border-[#c89c6b] text-[#c89c6b] rounded flex items-center justify-center hover:bg-[#c89c6b]/10 transition-colors font-bold text-xl">
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedTicket && (
                                        <button className="w-full mt-6 bg-[#112b38] hover:bg-[#1a3d52] text-white py-4 rounded-xl font-bold text-base sm:text-lg transition-colors">
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div className="bg-white rounded-b-xl p-4 sm:p-6 shadow-md border border-t-0 border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">Event Description</h2>
                                    <div className="prose max-w-none text-[#c89c6b] text-sm sm:text-base">
                                        <Text>{event.description}</Text>
                                        <Text className="mt-4">Join us for an unforgettable experience at {event.title}. This event promises to be one of the most exciting gatherings of the year.</Text>
                                    </div>
                                </div>
                            )}

                            {/* More Info Tab */}
                            {activeTab === 'moreInfo' && (
                                <div className="bg-white rounded-b-xl p-4 sm:p-6 shadow-md border border-t-0 border-gray-200">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">More Information</h2>
                                    <div className="space-y-4 text-sm sm:text-base text-[#c89c6b]">
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Age Restriction</h3>
                                            <Text>This event is open to all ages. Children under 12 must be accompanied by an adult.</Text>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Parking</h3>
                                            <Text>Free parking is available at the venue. Additional paid parking options are nearby.</Text>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">What to Bring</h3>
                                            <Text>Valid ID, your ticket confirmation, and comfortable clothing recommended.</Text>
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
                                            <div className="text-xs sm:text-sm text-[#c89c6b]">Location</div>
                                        </div>
                                        <div>
                                            <Text>
                                                Etihad Park
                                            </Text>
                                            <Text>
                                                {event.fullAddress}
                                            </Text>
                                            <Text className='flex gap-2 items-center '>View Direction <FaGreaterThan /></Text>
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
                                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#112b38]">Site Plan</h2>
                                <div className="relative w-full h-[250px] sm:h-[300px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src='/images/mapImage.png'
                                        className='w-full h-full'
                                    />
                                </div>
                            </div>

                            {/* Why Buy Section */}
                            <div>
                                {/* Why buy with Platinumlist */}
                                <p className='text-base sm:text-lg font-semibold mb-4 sm:mb-5 md:mb-6'>
                                    Why buy with Platinumlist?
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
                                    {[
                                        {
                                            icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                                            title: "Secure Checkout",
                                            desc: "Fast & Secured Payment",
                                            color: "text-blue-600"
                                        },
                                        {
                                            icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                                            title: "Instant Confirmation",
                                            desc: "Refund guarantee options",
                                            color: "text-green-600"
                                        },
                                        {
                                            icon: <Ticket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                                            title: "Official Ticket Seller",
                                            desc: "Used by 10m+ people",
                                            color: "text-purple-600"
                                        },
                                        {
                                            icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                                            title: "24/7 Customer Service",
                                            desc: "Reliable after sales support",
                                            color: "text-orange-600"
                                        }
                                    ].map((feature, index) => (
                                        <div
                                            key={index}
                                            className="cursor-pointer flex items-center justify-center flex-col"
                                        >
                                            <div className={`mb-3 sm:mb-4 ${feature.color} text-center transition-transform duration-300`}>
                                                {feature.icon}
                                            </div>
                                            <div className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800  transition-colors">
                                                {feature.title}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-500  transition-colors">
                                                {feature.desc}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Payment Methods */}
                                <div className="mb-8 sm:mb-10 md:mb-12">
                                    <div className="flex flex-col">
                                        <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">You choose how to pay</div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                                            <div className="flex items-center justify-center   transition-shadow">
                                                <img
                                                    src='/images/1) - Juice MCB LOGO.png'
                                                    alt="Juice MCB"
                                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center   transition-shadow">
                                                <img
                                                    src='/images/2) - emtel-blink-logo-500px.png'
                                                    alt="Emtel Blink"
                                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center   transition-shadow">
                                                <img
                                                    src='/images/3) - Visa-Logo-2014.png'
                                                    alt="Visa"
                                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center   transition-shadow">
                                                <img
                                                    src='/images/4) - Mastercard-logo.png'
                                                    alt="Mastercard"
                                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center   transition-shadow">
                                                <img
                                                    src='/images/5) - maucas-logo-1024x263.png'
                                                    alt="Maucas"
                                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center   transition-shadow">
                                                <img
                                                    src='/images/6) - My.t Money .png'
                                                    alt="My.t Money"
                                                    className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6 ">
                            {/* Share on Social */}
                            <div className="max-w-lg mx-auto p-8 rounded-lg shadow-lg">
                                <div className='bg-white border border-blue-200 rounded-xl p-6 shadow-sm'>

                                    {/* Top row */}
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">📅</span>
                                            <span className="font-medium">Sat 18 Oct</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">🕒</span>
                                            <span>Doors: 20:00</span>
                                            <span>Start: 20:00</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <hr className="my-5" />

                                    {/* Sale + Countdown */}
                                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                                ⏱
                                            </div>
                                            <div>
                                                <p className="text-blue-600 font-semibold">Buy now</p>
                                                <p className="text-xs text-gray-500">Sale ends in</p>
                                            </div>
                                        </div>

                                        {/* Countdown */}
                                        <div className="flex gap-4 text-center">
                                            {[
                                                { value: "03", label: "Days" },
                                                { value: "22", label: "Hours" },
                                                { value: "56", label: "Mins" },
                                                { value: "17", label: "Seconds" },
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
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="text-xl font-bold text-red-500">Rs 0</p>
                                        </div>

                                        <button className="bg-rose-400 hover:bg-rose-500 text-white font-semibold px-8 py-3 rounded-md transition">
                                            Book Now
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom actions */}
                                <div className="flex justify-center gap-10 mt-6 text-sm text-gray-600">
                                    <button className="flex items-center gap-2 hover:text-blue-600">
                                        📅 Add to calendar
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-blue-600">
                                        🔗 Share event
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
                                    <button className="text-gray-400 hover:text-rose-500 transition">
                                        ❤️
                                    </button>

                                    <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
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
                                    <button className="text-gray-400 hover:text-rose-500 transition">
                                        ❤️
                                    </button>

                                    <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
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
                                    <button className="text-gray-400 hover:text-rose-500 transition">
                                        ❤️
                                    </button>

                                    <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                                        ▶
                                    </button>
                                </div>
                            </div>

                            {/* Advertisement */}
                            <div className="bg-gray-200 rounded-xl p-8 sm:p-12 shadow-md border border-gray-300 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                                <div className="text-center">
                                    <div className="text-4xl sm:text-6xl font-bold text-gray-400 mb-2">ADS</div>
                                    <div className="text-xs sm:text-sm text-gray-500">Advertisement Space</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
}
