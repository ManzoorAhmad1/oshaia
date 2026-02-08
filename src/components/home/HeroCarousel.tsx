"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, User, Menu, ShoppingCart, Calendar, ChevronDown, LogOut, Settings, Ticket, Heart } from "lucide-react"
import { FaHome } from "react-icons/fa"
import { useRouter } from "next/navigation"
import AuthModal from '@/components/AuthModal'

const HeroCarousel = () => {
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [selectedDate, setSelectedDate] = useState("")
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

    const languageRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const dateInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

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
        setLanguageDropdownOpen(false)
        setProfileDropdownOpen(false)
    }

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    // Handle calendar icon click - IMPROVED VERSION
    const handleCalendarClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        
        console.log("Calendar clicked")
        
        // Method 1: Use ref to trigger click
        if (dateInputRef.current) {
            console.log("Date input found, clicking...")
            dateInputRef.current.click()
        } else {
            console.log("Date input not found")
            
            // Method 2: Create a temporary input element
            const tempInput = document.createElement('input')
            tempInput.type = 'date'
            tempInput.style.position = 'absolute'
            tempInput.style.opacity = '0'
            tempInput.style.height = '0'
            tempInput.style.width = '0'
            tempInput.style.pointerEvents = 'none'
            tempInput.max = getTodayDate()
            tempInput.value = selectedDate
            
            tempInput.onchange = (e: any) => {
                setSelectedDate(e.target.value)
                console.log("Date selected via temp input:", e.target.value)
                document.body.removeChild(tempInput)
            }
            
            document.body.appendChild(tempInput)
            tempInput.click()
            
            // Clean up after some time
            setTimeout(() => {
                if (document.body.contains(tempInput)) {
                    document.body.removeChild(tempInput)
                }
            }, 1000)
        }
        
        // Close other dropdowns
        setLanguageDropdownOpen(false)
        setProfileDropdownOpen(false)
    }, [selectedDate])

    // Handle date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value
        setSelectedDate(newDate)
        console.log("Date selected:", newDate)
        
        // Optional: Show selected date somewhere
        if (newDate) {
            const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
            console.log("Formatted date:", formattedDate)
        }
    }

    return (
        <>
        <div className="bg-white min-h-[70h] sm:min-h-[65vh]">

            {/* HERO CARD */}
            <div className="relative max-w-full sm:max-w-[1434.1px] h-[240px] sm:h-[300px] md:h-[340px] lg:h-[354.6px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-12 2xl:px-16 pt-4 sm:pt-6">
                <div className="relative w-full h-full rounded-xl sm:rounded-xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl">
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
                    <div className="bg-[#112b38] text-white w-full rounded-xl sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-3 lg:py-5 shadow-lg sm:shadow-xl lg:shadow-2xl">
                        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-12">
                            <NavItem
                                label="HOME"
                                active
                                icon={FaHome}
                                path='/'
                            />
                            <Divider className='text-orange-500' />
                            <NavItem
                                label="EVENTS"
                                path='/event'
                            />
                            <Divider className='text-orange-500' />
                            <NavItem
                                label="ABOUT US"
                                path='/about'
                            />
                            <Divider className='text-orange-500' />
                            <NavItem
                                label="HELP CENTER"
                                path='/help'
                            />
                        </div>
                    </div>
                </div>

                {/* SEARCH BAR SECTION */}
                <div className="relative mt-4 sm:-mt-6 md:-mt-8 box-border max-w-full sm:max-w-[1230.7px] h-[130px] mx-auto px-3 sm:px-4">
                    <div className="bg-white rounded-xl sm:rounded-xl lg:rounded-2xl h-[123px] mt-2 w-full shadow-md sm:shadow-lg border border-gray-100 px-4 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-4 lg:py-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 lg:gap-6">

                        {/* Search Bar with Calendar Icon INSIDE */}
                        <div className="relative w-full lg:w-[436px] flex-shrink-0">
                            <div className={`flex items-center gap-2 sm:gap-2 lg:gap-3 border border-[#c89c6b] ${searchFocused ? 'border-orange-500' : 'border-orange-500'} rounded-full px-3 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 h-[42px] sm:h-[44px] lg:h-[44.8px] transition-colors`}>
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#c89c6b] flex-shrink-0" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search event or category"
                                    className="w-full outline-none text-[11px] sm:text-xs lg:text-sm text-gray-700 placeholder:text-gray-400"
                                    onFocus={() => {
                                        setSearchFocused(true)
                                    }}
                                    onBlur={() => setSearchFocused(false)}
                                />

                                {/* Calendar Icon - WORKING SOLUTION */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={handleCalendarClick}
                                        className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                        aria-label="Select date"
                                        title="Select date"
                                    >
                                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#c89c6b] cursor-pointer" />
                                    </button>
                                    
                                    {/* Hidden date input - ALTERNATIVE APPROACH */}
                                    <div className="absolute top-0 left-0 w-full h-full opacity-0 overflow-hidden">
                                        <input
                                            ref={dateInputRef}
                                            type="date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            max={getTodayDate()}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Show selected date below search bar (optional) */}
                            {selectedDate && (
                                <div className="mt-1 text-xs text-gray-600">
                                    Selected date: {new Date(selectedDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2 lg:gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap w-full lg:w-auto">
                            {/* My Account Dropdown */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => {
                                        setProfileDropdownOpen(!profileDropdownOpen)
                                    }}
                                    className="flex items-center gap-1 text-xs sm:text-xs lg:text-sm text-gray-700 hover:text-[#c89c6b] transition-colors px-2 sm:px-2 py-1.5 sm:py-1.5 h-[42px] sm:h-[44px] lg:h-[44.8px] whitespace-nowrap"
                                >
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden xl:inline">My Account</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <Link
                                            href="/my-profile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#c89c6b] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">My Profile</span>
                                        </Link>
                                        <Link
                                            href="/my-tickets"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#c89c6b] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">My Tickets</span>
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#c89c6b] transition-colors"
                                            onClick={() => setProfileDropdownOpen(false)}
                                        >
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                                            <span className="text-sm font-medium">Wishlist</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-[#c89c6b] transition-colors"
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

                            <button 
                                className="bg-[#c89c6b] hover:bg-orange-600 text-white px-3 sm:px-3 lg:px-5 rounded-lg text-xs sm:text-xs lg:text-sm font-medium transition-colors shadow-md whitespace-nowrap h-[42px] sm:h-[44px] lg:h-[44.8px]"
                                onClick={() => {
                                    setAuthMode('signup')
                                    setIsAuthModalOpen(true)
                                }}
                            >
                                Sign Up
                            </button>

                            <button
                                onClick={removeSearchFocus}
                                className="hover:bg-gray-100 rounded-lg transition-colors w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center"
                            >
                                <Menu className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </button>

                            <button
                                onClick={removeSearchFocus}
                                className="relative hover:bg-gray-100 rounded-lg transition-colors w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center"
                            >
                                <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">
                                    0
                                </span>
                            </button>

                            {/* Language Dropdown */}
                            <div className="relative" ref={languageRef}>
                                <button
                                    onClick={() => {
                                        setLanguageDropdownOpen(!languageDropdownOpen)
                                    }}
                                    className="flex items-center gap-1 text-xs sm:text-xs lg:text-sm text-gray-700 hover:bg-gray-100 px-2 sm:px-2 rounded-lg transition-colors h-[42px] sm:h-[44px] lg:h-[44.8px] whitespace-nowrap"
                                >
                                    <span className="text-sm sm:text-base">🇬🇧</span>
                                    <span className="font-medium">EN</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {languageDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-32 sm:w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <button
                                            onClick={() => {
                                                console.log("Language changed to: EN")
                                                setLanguageDropdownOpen(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                                        >
                                            <span className="text-base">🇬🇧</span>
                                            <span className="font-medium">English</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log("Language changed to: ES")
                                                setLanguageDropdownOpen(false)
                                            }}
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

        </div>
        
        {/* Hidden global date input - WORKING SOLUTION */}
        <input
            ref={dateInputRef}
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="fixed top-0 left-0 opacity-0 w-1 h-1 pointer-events-none"
            max={getTodayDate()}
        />
        
        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)}
            initialMode={authMode}
        />
        </>
    )
}

export default HeroCarousel

const NavItem = ({ label, active = false, icon, path }: any) => {
    const router = useRouter()
    return (
        <p
            onClick={() => router.push(path)}
            className={`cursor-pointer font-bold text-[8px] xs:text-[9px] sm:text-xs md:text-sm lg:text-base xl:text-lg uppercase tracking-wide flex items-center gap-0.5 sm:gap-1 md:gap-2 hover:text-orange-400 transition-colors whitespace-nowrap ${active ? "text-orange-400" : "text-white"
                }`}
        >
            {icon && <span className="hidden md:inline text-sm lg:text-base"><FaHome /> </span>}
            {label}
        </p>
    )
}

const Divider = ({ className }: any) => <span className={`text-white/20 text-base sm:text-lg hidden md:inline ${className}`}>|</span>