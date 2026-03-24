"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Calendar, ChevronDown, LogOut, Menu, Search, ShoppingCart, User } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaHome } from "react-icons/fa"
import { Divider, NavItem } from "../home/HeroCarousel"

const NavSearchHeader = () => {
    const { t, language, setLanguage }: any = useLanguage()
    const pathname = usePathname()

    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [calendarView, setCalendarView] = useState(() => { const d = new Date(); return { month: d.getMonth(), year: d.getFullYear() } })
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [typingPlaceholder, setTypingPlaceholder] = useState(t.searchPlaceholder)
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
                if (charIndexRef.current < currentText.length) {
                    setTypingPlaceholder(searchPrefix + currentText.substring(0, charIndexRef.current + 1))
                    charIndexRef.current++
                } else {
                    setTimeout(() => { isDeletingRef.current = true }, 2000)
                }
            } else {
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

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) setLanguageDropdownOpen(false)
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileDropdownOpen(false)
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) setCalendarOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const removeSearchFocus = () => {
        if (searchRef.current) { searchRef.current.blur(); setSearchFocused(false) }
        setLanguageDropdownOpen(false)
        setProfileDropdownOpen(false)
    }

    // Calendar helpers
    const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
    const getFirstDayOfMonth = (month: number, year: number) => { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1 }

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
        e.stopPropagation(); e.preventDefault()
        setCalendarOpen(prev => !prev)
        setLanguageDropdownOpen(false)
        setProfileDropdownOpen(false)
    }, [])

    const handleDateSelect = (day: number) => {
        const { month, year } = calendarView
        setSelectedDate(new Date(year, month, day))
    }

    const prevMonth = () => setCalendarView(v => v.month === 0 ? { month: 11, year: v.year - 1 } : { month: v.month - 1, year: v.year })
    const nextMonth = () => setCalendarView(v => v.month === 11 ? { month: 0, year: v.year + 1 } : { month: v.month + 1, year: v.year })

    const isToday = (day: number) => { const t = new Date(); return calendarView.year === t.getFullYear() && calendarView.month === t.getMonth() && day === t.getDate() }
    const isSelected = (day: number) => { if (!selectedDate) return false; return calendarView.year === selectedDate.getFullYear() && calendarView.month === selectedDate.getMonth() && day === selectedDate.getDate() }
    const isPast = (day: number) => { const today = new Date(); today.setHours(0, 0, 0, 0); return new Date(calendarView.year, calendarView.month, day) < today }

    return (
        <div className="w-full bg-transparent relative">
            {/* Background Blue Strip - sits behind nav and search */}
            <div className="absolute top-0 left-0 right-0 z-0 w-full bg-[#112b38] h-20" />

            {/* Nav Bar */}
            <div className="relative z-50 w-full h-auto sm:h-[56px] lg:h-[68.6px] flex justify-center px-0 mb-0">
                <div className="bg-[#112b38] text-white w-full px-4 sm:px-6 lg:px-10 py-3 sm:py-3 lg:py-4 flex items-center justify-center">

                    {/* Desktop Nav */}
                    <div className="hidden sm:flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-12">
                        <NavItem label={t.home} active={pathname === '/'} icon={FaHome} path='/' showIcon={true} />
                        <Divider className='text-orange-500' />
                        <NavItem label={t.events} active={pathname === '/event' || pathname?.startsWith('/event/')} path='/event' />
                        <Divider className='text-orange-500' />
                        <NavItem label={t.aboutUs} active={pathname === '/about'} path='/about' />
                        <Divider className='text-orange-500' />
                        <NavItem label={t.helpCenter} active={pathname === '/help'} path='/help' />
                    </div>

                    {/* Mobile Nav */}
                    <div className="flex sm:hidden items-center justify-between">
                        <Link href="/" className="text-white font-bold text-sm tracking-wide">
                            Oshaia
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                            className="text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                            <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-x-0 top-0 z-[100] sm:hidden pt-[60px]">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
                    {/* Menu panel */}
                    <div className="relative mx-3 bg-[#112b38] rounded-2xl shadow-2xl overflow-hidden">
                        {[
                            { label: t.home, path: '/', active: pathname === '/' },
                            { label: t.events, path: '/event', active: pathname === '/event' || pathname?.startsWith('/event/') },
                            { label: t.aboutUs, path: '/about', active: pathname === '/about' },
                            { label: t.helpCenter, path: '/help', active: pathname === '/help' },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center px-6 py-4 text-sm font-semibold border-b border-white/10 last:border-0 transition-colors ${
                                    item.active ? 'text-[#c89c6b] bg-white/5' : 'text-white hover:text-[#c89c6b] hover:bg-white/5'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {/* Mobile auth buttons */}
                        <div className="flex gap-3 px-6 py-4 bg-white/5">
                            <button
                                className="flex-1 bg-transparent border-2 border-[#c89c6b] text-[#c89c6b] rounded-xl py-2.5 text-sm font-semibold"
                                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); setMobileMenuOpen(false) }}
                            >
                                {t.login}
                            </button>
                            <button
                                className="flex-1 bg-[#c89c6b] text-[#112b38] rounded-xl py-2.5 text-sm font-semibold"
                                onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); setMobileMenuOpen(false) }}
                            >
                                {t.signUp}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blue Strip */}

            {/* Search Bar */}
            <div className="relative z-40  w-full px-0">
                <div className="bg-white w-full shadow-md sm:shadow-lg border-b border-gray-200 ">
                    <div className="sm:max-w-[75%] mx-auto w-full  py-4  px-4 sm:px-6 lg:px-8  flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 lg:gap-6">
                        {/* Search input with calendar */}
                        <div className="relative w-full flex-1" ref={calendarRef}>
                            <div className={`flex items-center gap-2 sm:gap-2 lg:gap-3 border border-[#c89c6b] rounded-full px-3 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2 lg:py-3 h-[42px] sm:h-[44px] lg:h-[44.8px] transition-colors`}>
                                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#c89c6b] flex-shrink-0" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder={selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : typingPlaceholder}
                                    className="w-full outline-none border-none focus:outline-none focus:ring-0 text-[11px] sm:text-xs text-gray-700 placeholder:text-gray-400 whitespace-nowrap"
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                />
                                <button type="button" onClick={handleCalendarClick} className="flex items-center justify-center p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none" aria-label="Select date">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#c89c6b] cursor-pointer" />
                                </button>
                            </div>

            {/* Calendar Popup */}
                            {calendarOpen && (
                                <div className="absolute top-[calc(100%+6px)] left-0 sm:left-auto sm:right-[-180px] z-50 bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] px-2 pt-2 pb-1 w-[210px] select-none">
                                    <div className="flex items-center justify-between mb-1">
                                        <button type="button" onClick={prevMonth} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors text-sm">&#8249;</button>
                                        <span className="text-xs font-semibold text-gray-900">{MONTHS[calendarView.month]} {calendarView.year}</span>
                                        <button type="button" onClick={nextMonth} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors text-sm">&#8250;</button>
                                    </div>
                                    <div className="grid grid-cols-7">
                                        {DAYS.map(d => <div key={d} className="text-center text-[9px] font-medium text-gray-400 py-0.5">{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7">
                                        {buildCalendarDays().map((cell, i) => {
                                            if (cell.type !== 'cur') return <div key={i} className="text-center text-[10px] py-0.5 text-gray-300">{cell.day}</div>
                                            const past = isPast(cell.day)
                                            const selected = isSelected(cell.day)
                                            const today = isToday(cell.day)
                                            return (
                                                <button key={i} type="button" onClick={() => !past && handleDateSelect(cell.day)}
                                                    className={`text-center text-[10px] py-0.5 rounded-full transition-colors w-6 mx-auto
                                                        ${selected ? 'bg-[#112b38] text-white font-bold' : ''}
                                                        ${!selected && today ? 'font-bold text-[#112b38]' : ''}
                                                        ${!selected && past ? 'text-gray-300 cursor-default' : ''}
                                                        ${!selected && !past ? 'text-gray-700 hover:bg-gray-100 cursor-pointer' : ''}`}>
                                                    {cell.day}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0 w-full sm:w-auto">
                            {/* My Account - visible on all screens */}
                            <div className="relative" ref={profileRef}>
                                <div className="flex items-center h-[42px] sm:h-[44px] lg:h-[44.8px] gap-0">
                                    <Link href="/account" className="flex items-center gap-1 text-xs text-gray-700 hover:text-[#c89c6b] transition-colors pl-2 py-1.5 h-full whitespace-nowrap">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden xl:inline">{t.myAccount}</span>
                                    </Link>
                                    <button onClick={(e) => { e.stopPropagation(); setProfileDropdownOpen(!profileDropdownOpen) }} className="px-1 h-full flex items-center justify-center text-gray-700 hover:text-[#c89c6b] transition-colors">
                                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                                {profileDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <Link href="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[#112b38] hover:text-white text-xs whitespace-nowrap text-gray-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="8" r="4" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                            My Profile
                                        </Link>
                                        <Link href="/profile?tab=bookings" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[#112b38] hover:text-white text-xs whitespace-nowrap text-gray-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" /><path strokeLinecap="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" /><path strokeLinecap="round" strokeWidth="2" d="M9 16l2 2 4-4" /></svg>
                                            Booking History
                                        </Link>
                                        <Link href="/profile?tab=tickets" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-[#112b38] hover:text-white text-xs whitespace-nowrap text-gray-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                            My Tickets
                                        </Link>
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <button onClick={() => { setProfileDropdownOpen(false); setAuthMode('login'); setIsAuthModalOpen(true) }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs whitespace-nowrap text-red-500 transition-colors flex items-center gap-2">
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Login / Sign Up - hidden on mobile, shown in mobile menu */}
                            <div className="hidden sm:flex">
                                <button className="bg-transparent border-2 border-[#112b38] text-[#112b38] hover:bg-[#112b38] hover:text-[#c89c6b] hover:border-[#112b38] px-3 rounded-l-lg text-xs font-medium transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap h-[42px] sm:h-[44px] lg:h-[44.8px]"
                                    onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true) }}>
                                    {t.login}
                                </button>
                                <button className="bg-transparent border-2 border-[#112b38] text-[#112b38] hover:bg-[#c89c6b] hover:text-[#112b38] hover:border-[#c89c6b] px-3 rounded-r-lg text-xs font-medium transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap h-[42px] sm:h-[44px] lg:h-[44.8px]"
                                    onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true) }}>
                                    {t.signUp}
                                </button>
                            </div>

                            {/* Menu - hidden, menu now in hamburger only */}

                            {/* Cart */}
                            <button onClick={removeSearchFocus} className="relative hover:bg-[#c89c6b] rounded-lg transition-all duration-300 hover:scale-110 w-[38px] sm:w-[40px] lg:w-[44.8px] h-[42px] sm:h-[44px] lg:h-[44.8px] flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">0</span>
                            </button>

                            {/* Language */}
                            <div className="relative" ref={languageRef}>
                                <button onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} className="flex items-center gap-1 text-xs text-gray-700 hover:bg-[#c89c6b] hover:text-white px-2 rounded-lg transition-all duration-300 h-[42px] sm:h-[44px] lg:h-[44.8px] whitespace-nowrap">
                                    <img src={language === 'en' ? "https://flagcdn.com/gb.svg" : "https://flagcdn.com/fr.svg"} alt={language === 'en' ? "EN" : "FR"} className="w-5 h-3.5 object-cover rounded" />
                                    <span className="font-medium">{language === 'en' ? 'EN' : 'FR'}</span>
                                    <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {languageDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-32 sm:w-36 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
                                        <button onClick={() => { setLanguage('en'); setLanguageDropdownOpen(false) }} className={`flex items-center gap-3 w-full px-2 py-1.5 hover:bg-[#c89c6b] hover:text-white transition-all duration-300 text-xs whitespace-nowrap ${language === 'en' ? 'bg-[#c89c6b] text-white' : 'text-gray-700'}`}>
                                            <img src="https://flagcdn.com/gb.svg" alt="EN" className="w-5 h-3.5 object-cover rounded" />
                                            <span className="font-medium">{t.english}</span>
                                        </button>
                                        <button onClick={() => { setLanguage('fr'); setLanguageDropdownOpen(false) }} className={`flex items-center gap-3 w-full px-2 py-1.5 hover:bg-[#c89c6b] hover:text-white transition-all duration-300 text-xs whitespace-nowrap ${language === 'fr' ? 'bg-[#c89c6b] text-white' : 'text-gray-700'}`}>
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

export default NavSearchHeader
