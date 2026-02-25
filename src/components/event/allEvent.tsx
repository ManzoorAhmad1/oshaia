"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Mock data array with images and videos
const slides = [
    {
        id: 1,
        type: "image",
        url: "/images/BANNER - SAMPLE/fire-horse-grid-1 1090x1080.jpg",
        alt: "Festival Crowd",
        duration: 5,
    },
    {
        id: 2,
        type: "image",
        url: "/images/BANNER - SAMPLE/Home Page Carousel.jpg",
        alt: "Concert Performance",
        duration: 5,
    },
    {
        id: 4,
        type: "image",
        url: "/images/BANNER - SAMPLE/Video For Carousel and Main Event(Where Choose Tickets Or Seats)1.jpg",
        alt: "DJ Performance",
        duration: 5,
    },
    {
        id: 5,
        type: "image",
        url: "/images/BANNER - SAMPLE/Video For Carousel and Main Event(Where Choose Tickets Or Seats)2.jpg",
        alt: "Dance Performance",
        duration: 5,
    }
]

const AllEvents = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [timeLeft, setTimeLeft] = useState(slides[0].duration)
    const [isMuted, setIsMuted] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Auto-slide functionality
    useEffect(() => {
        if (isPlaying) {
            startAutoSlide()
        } else {
            clearAutoSlide()
        }

        return () => {
            clearAutoSlide()
            clearProgressTimer()
        }
    }, [currentSlide, isPlaying])

    const startAutoSlide = () => {
        clearAutoSlide()
        const currentDuration = slides[currentSlide].duration

        // Reset timer for current slide
        setTimeLeft(currentDuration)

        // Progress timer (countdown)
        progressIntervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearProgressTimer()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        // Slide transition timer
        intervalRef.current = setTimeout(() => {
            nextSlide()
        }, currentDuration * 1000)
    }

    const clearAutoSlide = () => {
        if (intervalRef.current) {
            clearTimeout(intervalRef.current)
            intervalRef.current = null
        }
    }

    const clearProgressTimer = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
        }
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(videoRef.current.muted)
        }
    }

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
        }
    }

    const currentSlideData = slides[currentSlide]

    return (
        <div className="w-full max-w-[85%] h-auto mx-auto mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 mt-16 sm:mt-24 md:mt-28">
            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-2 sm:mb-3 lg:mb-4 tracking-tight uppercase">
                All Event
            </h2>

            <div className="relative rounded-lg sm:rounded-xl lg:rounded-3xl overflow-hidden shadow-md sm:shadow-lg bg-white w-full h-auto">
                {/* Slide Container */}
                <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[357.5px] overflow-hidden">
                    {/* Progress Loader */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                            <svg className="loader-circle" viewBox="0 0 48 48" onClick={nextSlide}>
                                <g transform="translate(24, 24)">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                                        <rect
                                            key={index}
                                            fill={index > (currentSlideData.duration - timeLeft) * (10 / currentSlideData.duration) ? 'white' : 'rgba(255, 255, 255, 0.3)'}
                                            x="-1.5"
                                            y="-22"
                                            width="4.5"
                                            height="9"
                                            rx="2"
                                            transform={`rotate(${(index - 1) * 36})`}
                                        />
                                    ))}
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* Slide Content */}
                    {currentSlideData.type === "video" ? (
                        <div className="relative w-full h-full">
                            <video
                                ref={videoRef}
                                src={currentSlideData.url}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted={isMuted}
                                loop
                                playsInline
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                            {/* Mute Button - Only for videos */}
                            <button
                                onClick={toggleMute}
                                className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 sm:p-2 shadow transition-colors z-10"
                            >
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.189a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.531v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    ) : (
                        <Link href={`/event/${currentSlideData.id}`} className="relative w-full h-full block cursor-pointer">
                            <img
                                src={currentSlideData.url}
                                alt={currentSlideData.alt}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </Link>
                    )}

                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-1 sm:left-2 md:left-4 lg:left-6 top-[40%] p-1 sm:p-2 z-10"
                    >
                        <span className="">
                            <img
                                src='/images/left-chevron.png'
                                alt='slider button images'
                                className="w-[24px] h-[16px] sm:w-[30px] sm:h-[20px] lg:w-[36.5px] lg:h-[24.8px] object-cover"
                            />
                        </span>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-1 sm:right-2 md:right-4 lg:right-6 top-[40%] p-1 sm:p-2 z-10"
                    >
                        <img
                            src='/images/left-chevron.png'
                            alt='slider button images'
                            className="w-[24px] h-[16px] sm:w-[30px] sm:h-[20px] lg:w-[36.5px] lg:h-[24.8px] object-cover rotate-180"
                        />
                    </button>

                    {/* Dotted Navigation - Bottom Center */}
                    <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 sm:space-x-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 ${currentSlide === index
                                    ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-white rounded-full'
                                    : 'w-2 sm:w-3 h-1.5 sm:h-2 bg-white/60 rounded-full hover:bg-white/80'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllEvents