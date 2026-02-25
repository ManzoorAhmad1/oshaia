import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import { Text } from "rizzui/typography";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const images = [
    "/TOP%20SLLER/22054_9834dd51a16eba240c0c6c97a5237e74-0-en1771488562.jpg",
    "/TOP%20SLLER/22078_75ef9ba7a61c8303513ef023de00195d-0-en1771489174.jpg",
    "/TOP%20SLLER/22099_3899b925d49dbee2814e0c1278a6dc64-0-en1771579388.jpg",
];

export default function EventCard() {
    const { t } = useLanguage();
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();
    // Auto slide with timer
    useEffect(() => {
        if (isPlaying) {
            startAutoSlide();
        } else {
            clearAutoSlide();
        }

        return () => {
            clearAutoSlide();
            clearProgressTimer();
        };
    }, [index, isPlaying]);

    const startAutoSlide = () => {
        clearAutoSlide();
        setTimeLeft(10);

        // Progress timer (countdown) - 300ms per segment
        progressIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearProgressTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 300);

        // Slide transition timer
        intervalRef.current = setTimeout(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);
    };

    const clearAutoSlide = () => {
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const clearProgressTimer = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="w-full h-auto mx-auto mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 flex gap-2 flex-col gap:8 mt-6 sm:mt-8 md:mt-10">
            <div className="flex w-[85%] flex-col mx-auto">
                <div className="py-2">
                    <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-4 tracking-tight uppercase">
                        {t.topSeller}
                    </p>
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    {/* Left Half - Image Slider */}
                    <Link href={`/event/${index + 1}`} className="w-full sm:w-1/2 relative h-48 sm:h-[180px] md:h-[200.1px] rounded-lg sm:rounded-xl overflow-hidden block cursor-pointer">
                        <img
                            src={images[index]}
                            alt="Event"
                            className="w-full h-full object-cover transition-all duration-500"
                        />

                        {/* TOP SELLER */}
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md shadow-lg">
                            {t.topSeller.toUpperCase()}
                        </span>
                    </Link>

                    {/* Right Half - Content */}
                    <div className="w-full sm:w-1/2 h-auto sm:h-[180px] md:h-[200.1px] flex flex-col justify-between relative pt-6 sm:pt-8 md:pt-10">
                        {/* Timer Loader - Top Right */}
                        <div className="absolute top-0 right-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
                            <svg className="loader-circle w-full h-full" viewBox="0 0 48 48" onClick={() => setIndex((index + 1) % images.length)}>
                                <g transform="translate(24, 24)">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((segmentIndex) => (
                                        <rect
                                            key={segmentIndex}
                                            fill={segmentIndex > (10 - timeLeft) ? '#112b38' : 'rgba(17, 43, 56, 0.3)'}
                                            x="-1.5"
                                            y="-22"
                                            width="4.5"
                                            height="9"
                                            rx="2"
                                            transform={`rotate(${(segmentIndex - 1) * 36})`}
                                        />
                                    ))}
                                </g>
                            </svg>
                        </div>
                        {/* Main Content */}
                        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-3 md:mt-4">
                            {/* Event Titles */}
                            <p className="text-black text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                                Bel Suono: Three Pianos World Hits Gala <br className="hidden sm:block" /> at Zabeel Theatre, Dubai
                            </p>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                <div className="flex gap-2 items-center flex-wrap">
                                    {/* Date and Time - Inline */}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} className="text-gray-500 sm:w-4 sm:h-4" />
                                            <span className="font-medium text-xs sm:text-sm">FEB 21 NOV</span>
                                        </div>

                                    </div>

                                    {/* Venue */}
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <MapPin size={14} className="text-gray-500 sm:w-4 sm:h-4" />
                                        <p className="text-xs sm:text-sm">{t.asFrom} <span>500</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    {/* Navigation Button */}
                                    <button
                                        onClick={() => setIndex((index + 1) % images.length)}
                                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#112b38] text-white rounded-full hover:bg-[#c89c6b] hover:scale-110 flex items-center justify-center border-2 border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
                                    >
                                        <img
                                            src='/images/double-chevron.png'
                                            alt='slider button images'
                                            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="w-[65%] mx-auto mt-20 flex flex-col">
                <Link href="/event/3" className="w-full h-[200px] rounded-lg overflow-hidden block cursor-pointer">
                    <img
                        src='/TOP%20SLLER/22054_9834dd51a16eba240c0c6c97a5237e74-0-en1771488562.jpg'
                        alt="Event"
                        className="w-full h-[200px] object-cover transition-all duration-500 rounded-lg"
                    />
                </Link>
                <div className="w-full flex items-center justify-end mt-4">
                    <Text className="cursor-pointer text-[#112b38] hover:text-[#c89c6b] transition-colors duration-300 font-medium" onClick={() => router.push('/help')}>{t.sponsers}{' '}{t.advertisingWithUs} </Text>
                </div>
            </div>
        </div>
    );
}