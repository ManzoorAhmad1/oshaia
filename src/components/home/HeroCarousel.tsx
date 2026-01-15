"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, User, Menu, ShoppingCart, Calendar, Home } from "lucide-react"

const HeroCarousel = () => {
    return (
        <div className="bg-white min-h-screen">

            {/* HERO CARD */}
            <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 lg:py-8">
                <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[580px] xl:h-[650px] 2xl:h-[720px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
                    <Image
                        src="/images/banner.png"
                        alt="Oshaia - Beyond your Journey"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700/60 via-red-600/50 to-blue-700/60" />

                    {/* Center Text */}
                    
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
                     <Image
                        src="/images/ALL PNG-01.png"
                        alt="Oshaia - Beyond your Journey"
                        fill
                        className="object-cover"
                        priority
                    />
                    </div>
                </div>

                {/* FLOATING NAV */}
                <div className="relative -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-20 xl:-mt-24 2xl:-mt-28 max-w-7xl mx-auto flex justify-center px-2 sm:px-4 z-10">
                    <div className="bg-[#0d2147] text-white w-full rounded-xl sm:rounded-2xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-4 md:py-5 lg:py-6 flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-12 xl:gap-16 shadow-xl sm:shadow-2xl flex-wrap">
                        <NavItem label="HOME" active icon={<Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} />
                        <Divider />
                        <NavItem label="EVENTS" />
                        <Divider />
                        <NavItem label="ABOUT US" />
                        <Divider />
                        <NavItem label="HELP CENTER" />
                    </div>
                </div>

                {/* SEARCH BAR SECTION */}
                <div className="relative -mt-4 sm:-mt-6 md:-mt-8 max-w-[1600px] mx-auto px-2 sm:px-4">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border border-gray-100 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 lg:py-12 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

                        {/* Search */}
                        <div className="flex items-center gap-2 sm:gap-3 border-2 border-gray-200 rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 w-full lg:w-[420px] xl:w-[500px] 2xl:w-[600px] hover:border-orange-400 transition-colors">
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search event or category"
                                className="w-full outline-none text-xs sm:text-sm lg:text-base text-gray-700 placeholder:text-gray-400"
                            />
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 flex-shrink-0" />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-center lg:justify-end gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 flex-wrap">
                            <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-orange-500 transition-colors px-2 py-1.5 sm:px-0 sm:py-0">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                                <span className="hidden sm:inline">My Account</span>
                            </button>

                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-colors shadow-md whitespace-nowrap">
                                Sign Up
                            </button>

                            <button className="p-1.5 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                <Menu className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
                            </button>

                            <button className="relative p-1.5 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-700" />
                                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-[10px] lg:text-xs w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full font-bold">
                                    0
                                </span>
                            </button>

                            <button className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm lg:text-base text-gray-700 hover:bg-gray-100 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 lg:py-2.5 rounded-lg transition-colors">
                                <span className="text-sm sm:text-base lg:text-lg">🇬🇧</span>
                                <span className="font-medium">EN</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* BEST OF SESSASSON VIDEO SLIDER SECTION */}
            
        </div>
    )
}

export default HeroCarousel

const NavItem = ({ label, active = false, icon }: any) => (
    <Link
        href="#"
        className={`font-bold text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg uppercase tracking-wide flex items-center gap-1 sm:gap-2 hover:text-orange-400 transition-colors whitespace-nowrap ${active ? "text-orange-400" : "text-white"
            }`}
    >
        {icon && <span className="hidden sm:inline">{icon}</span>}
        {label}
    </Link>
)

const Divider = () => <span className="text-white/20 text-base sm:text-lg hidden md:inline">|</span>
