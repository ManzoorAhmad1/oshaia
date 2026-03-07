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
    const [bottomIndex, setBottomIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(6);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    // Auto slide for bottom carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setBottomIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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
        setTimeLeft(6);

        // Progress timer (countdown) - 1000ms per segment (1 second)
        progressIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearProgressTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Slide transition timer - 6 seconds
        intervalRef.current = setTimeout(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000);
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

    return (
        <div className="w-full h-auto mx-auto mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 flex gap-2 flex-col gap:8 mt-6 sm:mt-8 md:mt-10">
            <div className="flex w-[85%] flex-col mx-auto">
                <div className="py-2">
                    <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-4 tracking-tight uppercase">
                        {t.topSeller}
                    </p>
                </div>
                <div className="w-full flex flex-col sm:flex-row ">
                    {/* Left Half - Image Slider */}
                    <Link href={`/event/${index + 1}`} className="w-full sm:w-1/2 relative h-48 sm:h-[180px] md:h-[200.1px] rounded-tl-lg rounded-lb-lg overflow-hidden block cursor-pointer">
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
                    <div className="w-full px-4 box-border shadow-md rounded-tr-lg rounded-br-lg sm:w-1/2 h-auto sm:h-[180px] md:h-[200.1px] flex flex-col justify-between relative pt-6 sm:pt-8 md:pt-10">
                        {/* Timer Loader - Top Right */}
                        {/* Timer Loader - Top Right */}
                        <div className="absolute top-0 right-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-3 md:mr-4">
                            <svg
                                className="loader-spinner w-full h-full cursor-pointer rotating"
                                viewBox="0 0 30 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            // onClick={goToNextSlide}
                            >
                                {[
                                    { path: "M27.5005 6.38885L25.7058 7.56105C23.524 4.41549 20.0528 2.42183 16.1824 2.09124L16.3721 1.95767e-05C20.8962 0.386322 24.9522 2.71505 27.5005 6.38885Z", condition: timeLeft > 5 },
                                    { path: "M26.5002 19.1499C27.2222 17.5683 27.5882 15.8801 27.5882 14.1325C27.5882 12.3849 27.2222 10.6968 26.5002 9.11519L28.4783 8.26504C29.3233 10.1161 29.7517 12.0901 29.7517 14.1325C29.7517 16.1749 29.3233 18.149 28.4783 20L26.5002 19.1499Z", condition: timeLeft > 4 },
                                    { path: "M16.5 28L16.3103 25.9088C20.1808 25.5782 23.652 23.5845 25.8338 20.439L27.6284 21.6112C25.0801 25.285 21.0241 27.6136 16.5 28Z", condition: timeLeft > 3 },
                                    { path: "M3.03551 21.6112L4.83017 20.439C7.01195 23.5845 10.4831 25.5782 14.3536 25.9088L14.1639 28C9.63983 27.6137 5.58377 25.285 3.03551 21.6112Z", condition: timeLeft > 2 },
                                    { path: "M4.00009 9.1017C3.27807 10.6833 2.912 12.3714 2.912 14.119C2.912 15.8666 3.27807 17.5547 4.00009 19.1363L2.02196 19.9865C1.17691 18.1355 0.748535 16.1614 0.748535 14.119C0.748535 12.0767 1.17691 10.1026 2.02196 8.25156L4.00009 9.1017Z", condition: timeLeft > 1 },
                                    { path: "M14.1287 -3.79799e-06L14.3184 2.09121C10.4479 2.42181 6.97673 4.41547 4.79495 7.56104L3.00028 6.38883C5.54855 2.71503 9.60461 0.386439 14.1287 -3.79799e-06Z", condition: timeLeft > 0 }
                                ].map((item, index) => (
                                    <path
                                        key={index}
                                        d={item.path}
                                        fill={item.condition ? '#112b38' : '#e5e7eb'}
                                        className="transition-colors duration-300"
                                    />
                                ))}
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
            <div className="w-[65%] mx-auto mt-20 flex flex-col relative">
                <div className="w-full h-[200px] rounded-lg overflow-hidden relative shadow-md">
                    {images.map((img, i) => (
                        <Link
                            key={i}
                            href={`/event/${i + 1}`}
                            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${i === bottomIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <img
                                src={img}
                                alt="Event"
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    ))}

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setBottomIndex(i);
                                }}
                                className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${i === bottomIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full flex items-center justify-end mt-4">
                    <Text className="cursor-pointer text-[#112b38] hover:text-[#c89c6b] transition-colors duration-300 font-medium" onClick={() => router.push('/help')}>{t.sponsers}{' '}{t.advertisingWithUs} </Text>
                </div>
            </div>
        </div>
    );
}