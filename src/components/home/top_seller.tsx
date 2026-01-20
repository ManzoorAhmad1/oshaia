import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronRight, ChevronLeft, MapPin } from "lucide-react";

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
        <div className="max-w-full sm:max-w-[914px] h-auto sm:h-[225.1px] mx-auto mb-4 px-2 sm:px-4 flex gap-2 flex-col gap:8 mt-16">
            <div className="flex w-full flex-col">
                <div className="py-2">
                    <p className="text-base sm:text-xl md:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-4 tracking-wide uppercase" style={{ letterSpacing: '0.01em' }}>
                        top seller
                    </p>
                </div>
                <div className="w-full flex flex-col  sm:flex-row gap-4">
                    {/* Left Half - Image Slider */}
                    <div className="w-full sm:w-1/2 relative h-64 sm:h-[200.1px] rounded-xl overflow-hidden">
                        <img
                            src={images[index]}
                            alt="Event"
                            className="w-full h-full object-cover transition-all duration-500"
                        />

                        {/* TOP SELLER */}
                        <span className="absolute top-4 left-4 bg-white text-xs font-bold px-4 py-2 rounded-md shadow-lg">
                            TOP SELLER
                        </span>
                    </div>

                    {/* Right Half - Content */}
                    <div className="w-full sm:w-1/2 sm:h-[200.1px] flex flex-col justify-between relative pt-10">
                        {/* Timer Loader - Top Right */}
                        <div className="absolute top-0 right-0 w-10 h-10">
                            <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
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
                                <span className="text-xs font-bold text-gray-700">{timeLeft}s</span>
                            </div>
                        </div>
                        {/* Main Content */}
                        <div className="flex flex-col gap-4 mt-4">
                            {/* Event Titles */}
                            <p className="text-black text-lg font-medium whitespace-nowrap">
                                Bel Suono: Three Pianos World Hits Gala <br /> at Zabeel Theatre, Dubai
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2 items-center">
                                    {/* Date and Time - Inline */}
                                    <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} className="text-gray-500" />
                                            <span className="font-medium text-sm">FEB 21 NOV</span>
                                        </div>

                                    </div>

                                    {/* Venue */}
                                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                                        <MapPin size={16} className="text-gray-500" />
                                        <p>AS From <span>500</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    {/* Navigation Button */}
                                    <button
                                        onClick={() => setIndex((index + 1) % images.length)}
                                        className="w-10 h-10 bg-black/70 text-white rounded-full hover:bg-black/90 flex items-center justify-center border-2 border-gray-300"
                                    >
                                        <img
                                            src='/images/double-chevron.png'
                                            alt='slider button images'
                                            className="w-6 h-6 object-cover"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <div className="max-w-full sm:max-w-[914px] h-auto sm:h-[109.31px] rounded-lg">
                <img
                    src='https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=800'
                    alt="Event"
                    className="w-full h-full object-cover transition-all duration-500 rounded-lg"
                />
            </div>
        </div>
    );
}