'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface EventCardProps {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    price: number;
    currency?: string;
    ticketsLeft: number;
    imageUrl: string;
    organizer?: string;
}

export default function EventCard({
    id,
    title,
    date,
    time,
    location,
    price,
    currency = 'Rs',
    ticketsLeft,
    imageUrl,
    organizer = 'BLAKKANONYM'
}: EventCardProps) {
    const { t } = useLanguage();
    const [imageError, setImageError] = useState(false);

    // Fallback image if Unsplash fails
    const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <Link href={`/event/${id}`} className='w-full h-[305.9px] block'>
            <div className="bg-white rounded-xl sm:rounded-2xl max-w-7xl mx-auto shadow-lg overflow-hidden border border-black hover:shadow-xl transition-all duration-300 p-3 sm:py-4 sm:pl-4 h-full cursor-pointer">

                <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-0">
                    {/* Event Image */}
                    <div className="relative w-full lg:w-[262.9px] h-[200px] sm:h-[240px] lg:h-full flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                            src={imageError ? fallbackImage : imageUrl}
                            alt={title}
                            fill
                            className="object-cover"
                            onError={handleImageError}
                            sizes="(max-width: 1024px) 100vw, 262.9px"
                        />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col justify-between h-full">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide lg:pl-4">{title}</h3>

                        {/* Navy Blue Section with Title and Info */}
                        <div 
                            className="relative text-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-lg lg:rounded-none overflow-hidden"
                            style={{
                                backgroundImage: `url(${imageError ? fallbackImage : imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {/* Dark overlay for readability */}
                            <div className="absolute inset-0 bg-[#112b38]/65"></div>
                            
                            <div className="flex-1 relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{date} {t.atTime} 06:57 am</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:ml-4 relative z-10">
                                <div className="bg-white text-[#112b38] px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs font-bold uppercase whitespace-nowrap">
                                    {t.lastTicketsLeft}
                                </div>
                            </div>
                        </div>

                        {/* Price and Button Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 lg:px-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                                <div className='flex items-center gap-2 sm:gap-4'>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.asFrom}</div>
                                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#c89c6b]">{currency} {price}</div>
                                </div>
                            </div>

                            <button className="w-full sm:w-auto py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#112b38] text-white hover:bg-[#c89c6b] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                                {t.getTicketsHere}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );
}