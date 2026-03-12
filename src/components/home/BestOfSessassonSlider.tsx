"use client"

import React, { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/context/LanguageContext"
import Link from "next/link"

// Mock data array with images and videos
const slides = [
    {
        id: 1,
        type: "image",
        url: "/BIG%20BANNER/Bollywood-Unwind-Slider.jpg",
        alt: "Bollywood Unwind",
        duration: 6,
    },
    {
        id: 101,
        type: "video",
        url: "/21971_cb42a1d4c3a2dd327fcce42ba642f04c-1-en1771248482.mp4",
        alt: "Video 1",
        duration: 6,
    },
    {
        id: 102,
        type: "video",
        url: "/22193_398acba9ebf32f60d280ccecab409d04-1-en1772118332.mp4",
        alt: "Video 2",
        duration: 6,
    },
    {
        id: 2,
        type: "image",
        url: "/BIG%20BANNER/kabul-slider-1.jpg",
        alt: "Kabul Slider",
        duration: 6,
    },
    {
        id: 4,
        type: "image",
        url: "/BIG%20BANNER/lv-new-slider.jpg",
        alt: "LV New Slider",
        duration: 6,
    },
    {
        id: 5,
        type: "image",
        url: "/BIG%20BANNER/y2k-slider.jpg",
        alt: "Y2K Slider",
        duration: 6,
    }
]

const BestOfSessassonSlider = () => {
    const { t } = useLanguage()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [timeLeft, setTimeLeft] = useState(slides[0].duration)
    const [isMuted, setIsMuted] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isHovering, setIsHovering] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Auto-slide functionality
    useEffect(() => {
        if (isPlaying && !isHovering) {
            startAutoSlide()
        } else {
            clearAutoSlide()
        }

        return () => {
            clearAutoSlide()
            clearProgressTimer()
        }
    }, [currentSlide, isPlaying, isHovering])

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
        <div className="w-full sm:w-[85%] h-auto mx-auto mb-6 sm:mb-8 md:mb-10 px-4 sm:px-4 mt-60 sm:mt-48 md:mt-40 lg:mt-28">
            <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-1 sm:mb-2 lg:mb-3 tracking-tight uppercase">
                {t.bestOfSeason}
            </h2>

            <div
                className="relative rounded-lg sm:rounded-xl lg:rounded-3xl overflow-hidden shadow-md sm:shadow-lg bg-white w-full h-auto"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Slide Container */}
                <div className="relative w-full h-[200px] sm:h-[280px] md:h-[320px] lg:h-[357.5px] overflow-hidden">
                    {/* Progress Loader */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
                            <svg
                                className="loader-spinner w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 cursor-pointer rotating"
                                viewBox="0 0 30 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={nextSlide}
                            >
                                {[
                                    "M27.5005 6.38885L25.7058 7.56105C23.524 4.41549 20.0528 2.42183 16.1824 2.09124L16.3721 1.95767e-05C20.8962 0.386322 24.9522 2.71505 27.5005 6.38885Z",
                                    "M26.5002 19.1499C27.2222 17.5683 27.5882 15.8801 27.5882 14.1325C27.5882 12.3849 27.2222 10.6968 26.5002 9.11519L28.4783 8.26504C29.3233 10.1161 29.7517 12.0901 29.7517 14.1325C29.7517 16.1749 29.3233 18.149 28.4783 20L26.5002 19.1499Z",
                                    "M16.5 28L16.3103 25.9088C20.1808 25.5782 23.652 23.5845 25.8338 20.439L27.6284 21.6112C25.0801 25.285 21.0241 27.6136 16.5 28Z",
                                    "M3.03551 21.6112L4.83017 20.439C7.01195 23.5845 10.4831 25.5782 14.3536 25.9088L14.1639 28C9.63983 27.6137 5.58377 25.285 3.03551 21.6112Z",
                                    "M4.00009 9.1017C3.27807 10.6833 2.912 12.3714 2.912 14.119C2.912 15.8666 3.27807 17.5547 4.00009 19.1363L2.02196 19.9865C1.17691 18.1355 0.748535 16.1614 0.748535 14.119C0.748535 12.0767 1.17691 10.1026 2.02196 8.25156L4.00009 9.1017Z",
                                    "M14.1287 -3.79799e-06L14.3184 2.09121C10.4479 2.42181 6.97673 4.41547 4.79495 7.56104L3.00028 6.38883C5.54855 2.71503 9.60461 0.386439 14.1287 -3.79799e-06Z"
                                ].map((pathData, i) => {
                                    const filledSegments = Math.floor((currentSlideData.duration - timeLeft) * (6 / currentSlideData.duration));
                                    const isFilled = i < filledSegments; // Left to right
                                    // const isFilled = i >= (6 - filledSegments); // Right to left (clockwise)

                                    return (
                                        <path
                                            key={i}
                                            d={pathData}
                                            fill={isFilled ? '#112b38' : '#e5e7eb'}
                                            className="transition-colors duration-300"
                                        />
                                    );
                                })}
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

export default BestOfSessassonSlider