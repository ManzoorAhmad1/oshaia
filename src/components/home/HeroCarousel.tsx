"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, User, Menu, ShoppingCart, Calendar, Home, ChevronDown, LogOut, Settings, Ticket, Heart } from "lucide-react"
import { FaHome } from "react-icons/fa";

const HeroCarousel = () => {
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)

    const languageRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setLanguageDropdownOpen(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Function to remove focus from search input
    const removeSearchFocus = () => {
        if (searchRef.current) {
            searchRef.current.blur()
            setSearchFocused(false)
        }
    }

    // Handle language selection
    const handleLanguageSelect = (lang: string) => {
        console.log(`Language changed to: ${lang}`)
        setLanguageDropdownOpen(false)
        removeSearchFocus() // Remove focus from search when language is selected
    }

    // Handle profile menu click
    const handleProfileMenuClick = () => {
        setProfileDropdownOpen(!profileDropdownOpen)
        setLanguageDropdownOpen(false)
        removeSearchFocus() // Remove focus from search when profile is clicked
    }

    // Handle language menu click
    const handleLanguageMenuClick = () => {
        setLanguageDropdownOpen(!languageDropdownOpen)
        setProfileDropdownOpen(false)
        removeSearchFocus() // Remove focus from search when language is clicked
    }

    return (
        <div className="bg-white min-h-[75vh] sm:min-h-[70vh] pb-8 sm:pb-12 lg:pb-16">

            {/* HERO CARD */}
            <div className="relative max-w-full sm:max-w-[1434.1px] h-[240px] sm:h-[300px] md:h-[340px] lg:h-[354.6px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-12 2xl:px-16 pt-4 sm:pt-6">
                <div className="relative w-full h-full rounded-xl sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl">
                    <Image
                        src="/images/BG photo/Copy of Copy of HOME.png"
                        alt="Oshaia - Beyond your Journey"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Center Text Container with Logo */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                        <div className="relative w-[240px] h-[57px] xs:w-[280px] xs:h-[66px] sm:w-[400px] sm:h-[95px] md:w-[500px] md:h-[118px] lg:w-[594.4px] lg:h-[140.7px]">
                            <Image
                                src="/images/Logo/white-01.png"
                                alt="Oshaia Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* FLOATING NAV */}
                <div className="relative -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-4 xl:-mt-24 2xl:-mt-24 max-w-full sm:max-w-[1140.2px] h-auto sm:h-[56px] lg:h-[68.6px] mx-auto flex justify-center px-3 sm:px-4 z-10 mb-4 sm:mb-0">
                    <div className="bg-[#0d2147] text-white w-full rounded-xl sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-3 lg:py-5 shadow-lg sm:shadow-xl lg:shadow-2xl">
                        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-12">
                            <NavItem
                                label="HOME"
                                active
                                icon={FaHome}
                            />
                            <Divider />
                            <NavItem
                                label="EVENTS"
                            />
                            <Divider />
                            <NavItem
                                label="ABOUT US"
                            />
                            <Divider />
                            <NavItem
                                label="HELP CENTER"
                            />
                        </div>
                    </div>
                </div>
                {/* SEARCH BAR SECTION */}
                <div className="relative mt-4 sm:-mt-6 md:-mt-8 box-border max-w-full sm:max-w-[1230.7px] h-[173px] mx-auto px-3 sm:px-4">
                    <div className="bg-white rounded-xl sm:rounded-xl lg:rounded-2xl h-[173px] w-full shadow-md sm:shadow-lg border border-gray-100 px-4 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-4 lg:py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 lg:gap-6">

                        {/* Search */}
                        <div className={`flex items-center gap-2 sm:gap-2 lg:gap-3 border ${searchFocused ? 'border-orange-500' : 'border-orange-500'} rounded-full px-3 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 w-full lg:w-[436px] h-[42px] sm:h-[44px] lg:h-[44.8px] transition-colors flex-shrink-0`}>
                            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#e9631e] flex-shrink-0" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search event or category"
                                className="w-full outline-none text-[11px] sm:text-xs lg:text-sm  text-gray-700 placeholder:text-gray-400"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#e9631e] flex-shrink-0" />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2 lg:gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap w-full lg:w-auto">
                            {/* My Account Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={handleProfileMenuClick}
                                    className="flex items-center gap-1 text-xs sm:text-xs lg:text-sm text-gray-700 hover:text-[#e9631e] transition-colors px-2 sm:px-2 py-1.5 sm:py-1.5 h-[42px] sm:h-[44px] lg:h-[44.8px] whitespace-nowrap"
                                >
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden xl:inline">My Account</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <Link
                                            href="/my-profile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#e9631e] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">My Profile</span>
                                        </Link>
                                        <Link
                                            href="/my-tickets"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#e9631e] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">My Tickets</span>
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#e9631e] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">Wishlist</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#e9631e] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">Settings</span>
                                        </Link>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-red-600 hover:text-red-700 transition-colors text-left"
                                            onClick={() => {
                                                console.log("Logout clicked")
                                                setProfileDropdownOpen(false)
                                            }}
                                        >
                                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-3 lg:px-5 rounded-lg text-xs sm:text-xs lg:text-sm font-medium transition-colors shadow-md whitespace-nowrap h-[42px] sm:h-[44px] lg:h-[44.8px]">
                                Sign Up
                            </button>

                            <button className="hover:bg-gray-100 rounded-lg transition-colors w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center">
                                <Menu className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </button>

                            <button className="relative hover:bg-gray-100 rounded-lg transition-colors w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">
                                    0
                                </span>
                            </button>

                            {/* Language Dropdown */}
                            <div className="relative" ref={languageRef}>
                                <button
                                    onClick={handleLanguageMenuClick}
                                    className="flex items-center gap-1 text-xs sm:text-xs lg:text-sm text-gray-700 hover:bg-gray-100 px-2 sm:px-2 rounded-lg transition-colors h-[42px] sm:h-[44px] lg:h-[44.8px] whitespace-nowrap"
                                >
                                    <span className="text-sm sm:text-base">🇬🇧</span>
                                    <span className="font-medium">EN</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {languageDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-32 sm:w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <button
                                            onClick={() => handleLanguageSelect('EN')}
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                                        >
                                            <span className="text-base">🇬🇧</span>
                                            <span className="font-medium">English</span>
                                        </button>
                                        <button
                                            onClick={() => handleLanguageSelect('ES')}
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                                        >
                                            <span className="text-base">🇪🇸</span>
                                            <span className="font-medium">Español</span>
                                        </button>
                                    </div>
                                )}
                            </div>
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
        className={`font-bold text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base xl:text-lg uppercase tracking-wide flex items-center gap-0.5 sm:gap-1 md:gap-2 hover:text-orange-400 transition-colors whitespace-nowrap ${active ? "text-orange-400" : "text-white"
            }`}
    >
        {icon && <span className="hidden md:inline text-sm lg:text-base"><FaHome /> </span>}
        {label}
    </Link>
)

const Divider = ({ className }: any) => <span className={`text-white/20 text-base sm:text-lg hidden md:inline ${className}`}>|</span>