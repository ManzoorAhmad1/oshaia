"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Calendar, ChevronDown, ChevronsLeft, ChevronsRight, LogOut, Menu, Search, ShoppingCart, User } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome } from "react-icons/fa"
import { Divider, NavItem } from "../home/HeroCarousel"

// Mock data array with images and videos


const TicketHeroSection = ({currentSlide,slides,setCurrentSlide,currentSlideData}:any) => {
    const { t } = useLanguage()

    const [isMuted, setIsMuted] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const [timeLeft, setTimeLeft] = useState(slides[0].duration)
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
            setTimeLeft((prev:any) => {
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
        setCurrentSlide((prev:any) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev:any) => (prev - 1 + slides.length) % slides.length)
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

    const { language, setLanguage }: any = useLanguage()
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [calendarView, setCalendarView] = useState(() => { const d = new Date(); return { month: d.getMonth(), year: d.getFullYear() } })
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
    const [typingPlaceholder, setTypingPlaceholder] = useState(t.searchPlaceholder)
    const [isTyping, setIsTyping] = useState(true)
    const languageRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    // Typing animation for placeholder
    const searchTextsEn = ["event or category", "concerts near you", "festivals this weekend", "sports events", "comedy shows"]
    const searchTextsFr = ["événement ou catégorie", "concerts près de chez vous", "festivals ce week-end", "événements sportifs", "spectacles comiques"]
    const searchTexts = language === 'fr' ? searchTextsFr : searchTextsEn
    const typingIndexRef = useRef(0)
    const charIndexRef = useRef(0)
    const isDeletingRef = useRef(false)

    useEffect(() => {
        const typeEffect = () => {
            const currentText = searchTexts[typingIndexRef.current]
            const searchPrefix = language === 'fr' ? 'Rechercher ' : 'Search '

            if (!isDeletingRef.current) {
                // Typing
                if (charIndexRef.current < currentText.length) {
                    setTypingPlaceholder(searchPrefix + currentText.substring(0, charIndexRef.current + 1))
                    charIndexRef.current++
                } else {
                    // Pause before deleting
                    setTimeout(() => {
                        isDeletingRef.current = true
                    }, 2000)
                }
            } else {
                // Deleting
                if (charIndexRef.current > 0) {
                    setTypingPlaceholder(searchPrefix + currentText.substring(0, charIndexRef.current - 1))
                    charIndexRef.current--
                } else {
                    isDeletingRef.current = false
                    typingIndexRef.current = (typingIndexRef.current + 1) % searchTexts.length
                }
            }
        }

        const interval = setInterval(typeEffect, isDeletingRef.current ? 50 : 100)
        return () => clearInterval(interval)
    }, [language, searchTexts])

    // Close dropdowns and calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setLanguageDropdownOpen(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false)
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setCalendarOpen(false)
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

    // Calendar helpers
    const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()

    // Monday-first: 0=Mo,1=Tu,...,6=Su
    const getFirstDayOfMonth = (month: number, year: number) => {
        const d = new Date(year, month, 1).getDay() // 0=Sun,1=Mon,...
        return d === 0 ? 6 : d - 1
    }

    const buildCalendarDays = () => {
        const { month, year } = calendarView
        const totalDays = getDaysInMonth(month, year)
        const firstDay = getFirstDayOfMonth(month, year)
        const prevDays = getDaysInMonth(month === 0 ? 11 : month - 1, month === 0 ? year - 1 : year)
        const cells: { day: number; type: 'prev' | 'cur' | 'next' }[] = []
        for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, type: 'prev' })
        for (let i = 1; i <= totalDays; i++) cells.push({ day: i, type: 'cur' })
        let next = 1
        while (cells.length % 7 !== 0) cells.push({ day: next++, type: 'next' })
        return cells
    }

    const handleCalendarClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setCalendarOpen(prev => !prev)
        setLanguageDropdownOpen(false)
        setProfileDropdownOpen(false)
    }, [])

    const handleDateSelect = (day: number) => {
        const { month, year } = calendarView
        const d = new Date(year, month, day)
        setSelectedDate(d)
        // calendar stays open
    }

    const prevMonth = () => setCalendarView(v => {
        if (v.month === 0) return { month: 11, year: v.year - 1 }
        return { month: v.month - 1, year: v.year }
    })

    const nextMonth = () => setCalendarView(v => {
        if (v.month === 11) return { month: 0, year: v.year + 1 }
        return { month: v.month + 1, year: v.year }
    })

    const isToday = (day: number) => {
        const t = new Date()
        return calendarView.year === t.getFullYear() && calendarView.month === t.getMonth() && day === t.getDate()
    }

    const isSelected = (day: number) => {
        if (!selectedDate) return false
        return calendarView.year === selectedDate.getFullYear() && calendarView.month === selectedDate.getMonth() && day === selectedDate.getDate()
    }

    const isPast = (day: number) => {
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const d = new Date(calendarView.year, calendarView.month, day)
        return d < today
    }
    const pathname = usePathname()

    return (
        <div className="max-w-full h-auto mx-auto">
            <div className="relative max-w-full sm:max-w-[1400.1px] h-[200px] sm:h-[280px] md:h-[320px] lg:h-[357.5px] mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 pt-4 sm:pt-6">
                <div className="relative w-full h-full rounded-xl sm:rounded-xl lg:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl lg:shadow-2xl">
                    <div className="relative w-full h-full">
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
                                        const isFilled = i < filledSegments;

                                        return (
                                            <path
                                                key={i}
                                                d={pathData}
                                                fill={isFilled ? '#112b38' : '#fff'}
                                                fillOpacity={isFilled ? 1 : 0.3}
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
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    className="w-full h-full object-cover"
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
                            <div className="relative w-full h-full">
                                <img
                                    src={currentSlideData.url}
                                    alt={currentSlideData.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Left Arrow */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-1 sm:left-2 md:left-4 lg:left-6 top-[40%] p-1 sm:p-2 z-10 transition-transform hover:scale-110"
                        >
                            <ChevronsLeft className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white drop-shadow-lg" strokeWidth={2.5} />
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-1 sm:right-2 md:right-4 lg:right-6 top-[40%] p-1 sm:p-2 z-10 transition-transform hover:scale-110"
                        >
                            <ChevronsRight className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white drop-shadow-lg" strokeWidth={2.5} />
                        </button>

                        {/* Dotted Navigation - Bottom Center */}
                        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 sm:space-x-2 z-10">
                            {slides.map((_:any, index:any) => (
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

            {/* Floating Navigation - MOVED OUTSIDE the slider and INCREASED Z-INDEX */}
            <div className="relative -mt-6 sm:-mt-10 md:-mt-14 lg:-mt-4 xl:-mt-24 2xl:-mt-24 max-w-full sm:max-w-[1140.2px] h-auto sm:h-[56px] lg:h-[68.6px] mx-auto flex justify-center px-4 z-20 mb-4 sm:mb-0">
                <div className="bg-[#112b38] text-white w-full rounded-xl sm:rounded-xl lg:rounded-2xl px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-3 lg:py-5 shadow-lg sm:shadow-xl lg:shadow-2xl">
                    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-12">
                        <NavItem
                            label={t.home}
                            active={pathname === '/'}
                            icon={FaHome}
                            path='/'
                            showIcon={true}
                        />
                        <Divider className='text-orange-500' />
                        <NavItem
                            label={t.events}
                            active={pathname === '/event' || pathname?.startsWith('/event/')}
                            path='/event'
                        />
                        <Divider className='text-orange-500' />
                        <NavItem
                            label={t.aboutUs}
                            active={pathname === '/about'}
                            path='/about'
                        />
                        <Divider className='text-orange-500' />
                        <NavItem
                            label={t.helpCenter}
                            active={pathname === '/help'}
                            path='/help'
                        />
                    </div>
                </div>
            </div>

            {/* SEARCH BAR SECTION - ADDED MARGIN-TOP */}
                    <div className="relative mt-4 sm:-mt-6 md:-mt-8 box-border max-w-full sm:max-w-[1230.7px] h-auto lg:h-[130px] mx-auto px-4">
                <div className="!pt-4 sm:!pt-12 bg-white rounded-xl sm:rounded-xl lg:rounded-2xl h-auto lg:h-[123px] mt-2 w-full shadow-md sm:shadow-lg border border-gray-100 px-4 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-4 lg:py-6">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6">
                        {/* Search Bar with Calendar Icon INSIDE */}
                        <div className="relative w-full lg:w-[436px] flex-shrink-0" ref={calendarRef}>
                            <div className={`flex items-center gap-2 sm:gap-2 lg:gap-3 border border-[#c89c6b] ${searchFocused ? 'border-orange-500' : 'border-orange-500'} rounded-full px-3 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 h-[42px] sm:h-[44px] lg:h-[44.8px] transition-colors`}>
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#c89c6b] flex-shrink-0" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder={selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : typingPlaceholder}
                                    className="w-full outline-none border-none focus:outline-none focus:ring-0 text-[11px] sm:text-xs lg:text-sm text-gray-700 placeholder:text-gray-400"
                                    onFocus={() => { setSearchFocused(true) }}
                                    onBlur={() => setSearchFocused(false)}
                                />

                                {/* Calendar Icon */}
                                <button
                                    type="button"
                                    onClick={handleCalendarClick}
                                    className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
                                    aria-label="Select date"
                                >
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#89c6b] cursor-pointer" />
                                </button>
                            </div>

                            {/* Custom Calendar Popup */}
                            {calendarOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-[-180px] z-50 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-5 w-[230px] select-none">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            type="button"
                                            onClick={prevMonth}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors text-lg font-light"
                                        >
                                            &#8249;
                                        </button>
                                        <span className="text-base font-semibold text-gray-900">
                                            {MONTHS[calendarView.month]} {calendarView.year}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={nextMonth}
                                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors text-lg font-light"
                                        >
                                            &#8250;
                                        </button>
                                    </div>

                                    {/* Day labels */}
                                    <div className="grid grid-cols-7 mb-2">
                                        {DAYS.map(d => (
                                            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
                                        ))}
                                    </div>

                                    {/* Date grid */}
                                    <div className="grid grid-cols-7 gap-y-1">
                                        {buildCalendarDays().map((cell, i) => {
                                            if (cell.type !== 'cur') {
                                                return <div key={i} className="text-center text-sm py-1.5 text-gray-300">{cell.day}</div>
                                            }
                                            const past = isPast(cell.day)
                                            const selected = isSelected(cell.day)
                                            const today = isToday(cell.day)
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => !past && handleDateSelect(cell.day)}
                                                    className={`text-center text-sm py-1.5 rounded-full transition-colors w-9 mx-auto
                                                                                                    ${selected ? 'font-bold text-gray-900' : ''}
                                                                                                    ${!selected && today ? 'font-bold text-gray-900' : ''}
                                                                                                    ${!selected && past ? 'text-gray-300 cursor-default' : ''}
                                                                                                    ${!selected && !past ? 'text-gray-700 hover:bg-gray-100 cursor-pointer font-medium' : ''}
                                                                                                `}
                                                >
                                                    {cell.day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2 lg:gap-3 flex-shrink-0 flex-wrap sm:flex-nowrap w-full lg:w-auto">
                            {/* My Account - navigates to account page */}
                            <div className="relative" ref={profileRef}>
                                <div className="flex items-center h-[42px] sm:h-[44px] lg:h-[44.8px] gap-0">
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-1 text-xs sm:text-xs lg:text-sm text-gray-700 hover:text-[#c89c6b] transition-colors pl-2 py-1.5 h-full whitespace-nowrap"
                                    >
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden xl:inline">{t.myAccount}</span>
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setProfileDropdownOpen(!profileDropdownOpen)
                                        }}
                                        className="px-1 h-full flex items-center justify-center text-gray-700 hover:text-[#c89c6b] transition-colors"
                                    >
                                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>

                                {profileDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[#112b38] hover:text-white text-sm text-gray-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                            My Profile
                                        </Link>
                                        <Link href="/profile?tab=bookings" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[#112b38] hover:text-white text-sm text-gray-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" /><path strokeLinecap="round" strokeWidth="2" d="M9 16l2 2 4-4" /></svg>
                                            Booking History
                                        </Link>
                                        <Link href="/profile?tab=tickets" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[#112b38] hover:text-white text-sm text-gray-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                            My Tickets
                                        </Link>
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button
                                                onClick={() => {
                                                    setProfileDropdownOpen(false)
                                                    setAuthMode('login')
                                                    setIsAuthModalOpen(true)
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex">
                                <button
                                    className="bg-transparent border-2 border-[#112b38] text-[#112b38] hover:bg-[#112b38] hover:text-[#c89c6b] hover:border-[#112b38] px-3 sm:px-3 lg:px-5 rounded-l-lg text-xs sm:text-xs lg:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap h-[42px] sm:h-[44px] lg:h-[44.8px]"
                                    onClick={() => {
                                        setAuthMode('login')
                                        setIsAuthModalOpen(true)
                                    }}
                                >
                                    {t.login}
                                </button>
                                <button
                                    className="bg-transparent border-2 border-[#112b38] text-[#112b38] hover:bg-[#c89c6b] hover:text-[#112b38] hover:border-[#c89c6b] px-3 sm:px-3 lg:px-5 rounded-r-lg text-xs sm:text-xs lg:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap h-[42px] sm:h-[44px] lg:h-[44.8px]"
                                    onClick={() => {
                                        setAuthMode('signup')
                                        setIsAuthModalOpen(true)
                                    }}
                                >
                                    {t.signUp}
                                </button>
                            </div>

                            <button
                                onClick={removeSearchFocus}
                                className="hover:bg-[#c89c6b] rounded-lg transition-all duration-300 hover:scale-110 w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center"
                            >
                                <Menu className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                            </button>

                            <button
                                onClick={removeSearchFocus}
                                className="relative hover:bg-[#c89c6b] rounded-lg transition-all duration-300 hover:scale-110 w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center"
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
                                    className="flex items-center gap-1 text-xs sm:text-xs lg:text-sm text-gray-700 hover:bg-[#c89c6b] hover:text-white px-2 sm:px-2 rounded-lg transition-all duration-300 h-[42px] sm:h-[44px] lg:h-[44.8px] whitespace-nowrap"
                                >
                                    <img
                                        src={language === 'en' ? "https://flagcdn.com/gb.svg" : "https://flagcdn.com/fr.svg"}
                                        alt={language === 'en' ? "EN" : "FR"}
                                        className="w-5 h-3.5 object-cover rounded"
                                    />
                                    <span className="font-medium">{language === 'en' ? 'EN' : 'FR'}</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {languageDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-32 sm:w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <button
                                            onClick={() => {
                                                setLanguage('en')
                                                setLanguageDropdownOpen(false)
                                            }}
                                            className={`flex items-center gap-3 w-full px-2 py-1.5 hover:bg-[#c89c6b] hover:text-white transition-all duration-300 text-sm ${language === 'en' ? 'bg-[#c89c6b] text-white' : 'text-gray-700'}`}
                                        >
                                            <img src="https://flagcdn.com/gb.svg" alt="EN" className="w-5 h-3.5 object-cover rounded" />
                                            <span className="font-medium">{t.english}</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLanguage('fr')
                                                setLanguageDropdownOpen(false)
                                            }}
                                            className={`flex items-center gap-3 w-full px-2 py-1.5 hover:bg-[#c89c6b] hover:text-white transition-all duration-300 text-sm ${language === 'fr' ? 'bg-[#c89c6b] text-white' : 'text-gray-700'}`}
                                        >
                                            <img src="https://flagcdn.com/fr.svg" alt="FR" className="w-5 h-3.5 object-cover rounded" />
                                            <span className="font-medium">{t.french}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicketHeroSection