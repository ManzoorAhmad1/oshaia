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
        <div className="bg-white min-h-[60vh] sm:min-h-[80vh]">

            {/* HERO CARD */}
            <div className="relative max-w-full sm:max-w-[1134.1px] h-[354.6px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-12 2xl:px-16 mt-6">
                <div className="relative sm:max-w-[1134.1px] h-[354.6px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                    <Image
                        src="/images/BG photo/Copy of Copy of HOME.png"
                        alt="Oshaia - Beyond your Journey"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Center Text Container with Logo */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="relative w-[594.4px] h-[140.7px] aspect-video">
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
                <div className="relative -mt-2 sm:-mt-4 md:-mt-4 lg:-mt-4 xl:-mt-24 2xl:-mt-24 max-w-full sm:max-w-[903.2px] h-[68.6px] mx-auto flex justify-center px-1 sm:px-4 z-10">
                    <div className="bg-[#0d2147] text-white w-full rounded-lg sm:rounded-2xl sm:max-w-[903.2px] h-[68.6px]  px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 md:py-5 lg:py-6 shadow-xl sm:shadow-2xl">
                        <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8 lg:gap-10 xl:gap-12">
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
                <div className="relative -mt-2 sm:-mt-6 md:-mt-8 max-w-full sm:max-w-[1007.7px] h-auto sm:h-[173px] mx-auto px-1 sm:px-4">
                    <div className="bg-white rounded-lg sm:rounded-2xl sm:max-w-[1007.7px] min-h-[173px] shadow-md sm:shadow-lg border border-gray-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">

                        {/* Search */}
                        <div className={`flex items-center gap-1 sm:gap-3 border-2 ${searchFocused ? 'border-orange-400' : 'border-gray-200'} rounded-full px-2 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-2.5 lg:py-3 w-full lg:w-[436px] h-[44.8px] transition-colors flex-shrink-0`}>
                            <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 flex-shrink-0" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search event or category"
                                className="w-full outline-none text-xs sm:text-sm lg:text-base text-gray-700 placeholder:text-gray-400"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500 flex-shrink-0" />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-center lg:justify-end gap-1 sm:gap-2 lg:gap-3 flex-shrink-0 flex-nowrap">
                            {/* My Account Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={handleProfileMenuClick}
                                    className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-orange-500 transition-colors px-2 py-1.5 sm:px-2.5 sm:py-2 h-[44.8px] whitespace-nowrap"
                                >
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden xl:inline">My Account</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <Link
                                            href="/my-profile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-orange-500 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">My Profile</span>
                                        </Link>
                                        <Link
                                            href="/my-tickets"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-orange-500 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">My Tickets</span>
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-orange-500 transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">Wishlist</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-orange-500 transition-colors"
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

                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 lg:px-5 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-colors shadow-md whitespace-nowrap h-[44.8px]">
                                Sign Up
                            </button>

                            <button className="hover:bg-gray-100 rounded-lg transition-colors w-[40px] sm:w-[44.8px] h-[44.8px] flex items-center justify-center">
                                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <button className="relative hover:bg-gray-100 rounded-lg transition-colors w-[40px] sm:w-[44.8px] h-[44.8px] flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">
                                    0
                                </span>
                            </button>

                            {/* Language Dropdown */}
                            <div className="relative" ref={languageRef}>
                                <button
                                    onClick={handleLanguageMenuClick}
                                    className="flex items-center gap-1 text-xs sm:text-sm lg:text-base text-gray-700 hover:bg-gray-100 px-2 sm:px-2.5 rounded-lg transition-colors h-[44.8px] whitespace-nowrap"
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
        className={`font-bold text-[10px] sm:text-sm md:text-lg lg:text-2xl xl:text-xl uppercase tracking-wide flex items-center gap-1 sm:gap-2 hover:text-orange-400 transition-colors whitespace-nowrap ${active ? "text-orange-400" : "text-white"
            }`}
    >
        {icon && <span className="hidden sm:inline"><FaHome /> </span>}
        {label}
    </Link>
)

const Divider = ({ className }: any) => <span className={`text-white/20 text-base sm:text-lg hidden md:inline ${className}`}>|</span>