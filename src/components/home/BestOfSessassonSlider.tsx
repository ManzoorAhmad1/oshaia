"use client"

import React from "react"

const BestOfSessassonSlider = () => {
    return (
        <div className="max-w-[1400px] mx-auto mb-4 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 tracking-wide uppercase" style={{letterSpacing: '0.01em'}}>Best of Sessasson</h2>
            <div className="relative rounded-3xl overflow-hidden shadow-lg bg-white">
                {/* Video Slide Image */}
                <img
                    src="/images/image-1768494567713.png"
                    alt="Best of Sessasson"
                    className="w-full h-[220px] sm:h-[320px] md:h-[400px] object-cover"
                />
                {/* Left Arrow */}
                <button className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-colors z-10">
                    <span className="text-3xl">&#x276E;</span>
                </button>
                {/* Right Arrow */}
                <button className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-colors z-10">
                    <span className="text-3xl">&#x276F;</span>
                </button>
                {/* Mute Icon */}
                <button className="absolute right-6 bottom-6 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v6h4l5 5V4l-5 5H9z" />
                    </svg>
                </button>
                {/* Slider Dots */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2 z-10">
                    <span className="w-10 h-2 rounded bg-gray-300 inline-block" />
                    <span className="w-10 h-2 rounded bg-gray-400 inline-block" />
                    <span className="w-10 h-2 rounded bg-gray-300 inline-block" />
                </div>
            </div>
        </div>
    )
}

export default BestOfSessassonSlider
