import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import { Text } from "rizzui/typography";

const images = [
    "https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800",
    "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=800",
];

export default function EventCard() {
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(3);
    const [isPlaying, setIsPlaying] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        setTimeLeft(3);

        // Progress timer (countdown)
        progressIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearProgressTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

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
        <div className="max-w-full sm:max-w-[914px] h-auto mx-auto mb-4 px-2 sm:px-4 flex gap-2 flex-col gap:8 mt-8 sm:mt-12 lg:mt-16">
            <div className="flex w-full flex-col">
                <div className="py-2">
                    <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-4 tracking-tight uppercase">
                        top seller
                    </p>
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-4">
                    {/* Left Half - Image Slider */}
                    <div className="w-full sm:w-1/2 relative h-48 sm:h-[180px] md:h-[200.1px] rounded-lg sm:rounded-xl overflow-hidden">
                        <img
                            src={images[index]}
                            alt="Event"
                            className="w-full h-full object-cover transition-all duration-500"
                        />

                        {/* TOP SELLER */}
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 bg-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md shadow-lg">
                            TOP SELLER
                        </span>
                    </div>

                    {/* Right Half - Content */}
                    <div className="w-full sm:w-1/2 h-auto sm:h-[180px] md:h-[200.1px] flex flex-col justify-between relative pt-6 sm:pt-8 md:pt-10">
                        {/* Timer Loader - Top Right */}
                        <div className="absolute top-0 right-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="rgba(0,0,0,0.1)"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray={`${(timeLeft / 3) * 100}, 100`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] sm:text-xs font-bold text-gray-700">{timeLeft}s</span>
                            </div>
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
                                        <p className="text-xs sm:text-sm">AS From <span>500</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    {/* Navigation Button */}
                                    <button
                                        onClick={() => setIndex((index + 1) % images.length)}
                                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 p-2 bg-black/70 text-white rounded-full hover:bg-black/90 flex items-center justify-center border-2 border-gray-300"
                                    >
                                        <img
                                            src='/images/double-chevron.png'
                                            alt='slider button images'
                                            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-cover"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="max-w-full sm:max-w-[914px] h-auto rounded-lg overflow-hidden mt-6">
                <img
                    src='https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=800'
                    alt="Event"
                    className="w-full h-32 sm:h-[100px] md:h-[109.31px] object-cover transition-all duration-500 rounded-lg"
                />
            </div>
            <div>
                <Text>Sponsers <span className="text-">Advertising with us</span></Text>
            </div>
        </div>
    );
}