'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';

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
    const [imageError, setImageError] = useState(false);

    // Fallback image if Unsplash fails
    const fallbackImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop';

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className='w-full h-[305.9px]'>
            <div className="bg-white rounded-xl sm:rounded-2xl max-w-7xl mx-auto shadow-lg overflow-hidden border border-black hover:shadow-xl transition-all duration-300 p-3 sm:py-4 sm:pl-4 h-full">

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
                        <div className="bg-[#001f3f] text-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 rounded-lg lg:rounded-none">
                            <div className="flex-1">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{date} at 06:57 am</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span>{location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:ml-4">
                                <div className="bg-white text-[#001f3f] px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs font-bold uppercase whitespace-nowrap">
                                    Last Tickets Left
                                </div>
                            </div>
                        </div>

                        {/* Price and Button Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 lg:px-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                                <div className='flex items-center gap-2 sm:gap-4'>
                                    <div className="text-xs sm:text-sm text-gray-600 font-medium">As From</div>
                                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#ff8c00]">{currency} {price}</div>
                                </div>
                            </div>

                            <button className="w-full sm:w-auto bg-[#001f3f] text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg font-bold text-xs sm:text-sm uppercase hover:bg-[#003366] transition-colors duration-200">
                                Get Tickets Here
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}