"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, User, Menu, ShoppingCart, Calendar, Home } from "lucide-react"

const HeroCarousel = () => {
    return (
        <div className="bg-white">

            {/* HERO CARD */}
            <div className="relative mx-20 my-8">
                <div className="relative h-[200px] sm:h-[250px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                        src="/images/Copy of Copy of HOME.png"
                        alt="Oshaia - Beyond your Journey"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700/60 via-red-600/50 to-blue-700/60" />

                    {/* Center Text */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
                        <p className="text-xs sm:text-sm tracking-widest uppercase mb-1">Welcome to</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold lowercase">oshaia</h1>
                        <p className="italic text-base sm:text-lg lg:text-xl mt-2">Beyond your Journey!</p>
                    </div>
                </div>

                {/* FLOATING NAV */}
                <div className="relative -mt-8 sm:-mt-20 max-w-7xl m-auto flex justify-center px-4 z-10">
                    <div className="bg-[#0d2147] text-white w-full rounded-2xl px-6 sm:px-10 lg:px-12 py-4 flex items-center gap-6 sm:gap-8 lg:gap-12 shadow-2xl flex-wrap justify-center">
                        <NavItem label="HOME" active icon={<Home className="w-5 h-5" />} />
                        <Divider />
                        <NavItem label="EVENTS" />
                        <Divider />
                        <NavItem label="ABOUT US" />
                        <Divider />
                        <NavItem label="HELP CENTER" />
                    </div>
                </div>
                <div className="relative -mt-8 sm:-mt-6 max-w-full mx-10 px-4 pb-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 sm:px-6 py-12 flex flex-wrap items-center justify-between gap-4">

                        {/* Search */}
                        <div className="flex items-center gap-3 border-2 border-gray-200 rounded-full px-5 py-2.5 w-full lg:w-[420px] hover:border-orange-400 transition-colors">
                            <Search className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search event or category"
                                className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
                            />
                            <Calendar className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                            <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-orange-500 transition-colors">
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">My Account</span>
                            </button>

                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-md">
                                Sign Up
                            </button>

                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Menu className="w-5 h-5 text-gray-700" />
                            </button>

                            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <ShoppingCart className="w-5 h-5 text-gray-700" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                    0
                                </span>
                            </button>

                            <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                                <span className="text-base">🇬🇧</span>
                                <span className="font-medium">EN</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH BAR SECTION */}

        </div>
    )
}

export default HeroCarousel

const NavItem = ({ label, active = false, icon }: any) => (
    <Link
        href="#"
        className={`font-bold text-sm sm:text-base uppercase tracking-wide flex items-center gap-2 hover:text-orange-400 transition-colors ${active ? "text-orange-400" : "text-white"
            }`}
    >
        {icon && icon}
        {label}
    </Link>
)

const Divider = () => <span className="text-white/20 text-lg hidden sm:inline">|</span>
