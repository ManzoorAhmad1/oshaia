'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import HeroCarousel from '@/components/home/HeroCarousel';
import Footer from '@/components/home/Footer';
import { useLanguage } from '@/context/LanguageContext';

interface Country {
    code: string;
    name: string;
    flag: string;
    isoCode: string;
}

const countries: Country[] = [
    { code: '+230', name: 'Mauritius', flag: 'https://flagcdn.com/mu.svg', isoCode: 'mu' },
    { code: '+1', name: 'United States', flag: 'https://flagcdn.com/us.svg', isoCode: 'us' },
    { code: '+44', name: 'United Kingdom', flag: 'https://flagcdn.com/gb.svg', isoCode: 'gb' },
    { code: '+33', name: 'France', flag: 'https://flagcdn.com/fr.svg', isoCode: 'fr' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/de.svg', isoCode: 'de' },
    { code: '+91', name: 'India', flag: 'https://flagcdn.com/in.svg', isoCode: 'in' },
    { code: '+86', name: 'China', flag: 'https://flagcdn.com/cn.svg', isoCode: 'cn' },
    { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/au.svg', isoCode: 'au' },
    { code: '+55', name: 'Brazil', flag: 'https://flagcdn.com/br.svg', isoCode: 'br' },
    { code: '+27', name: 'South Africa', flag: 'https://flagcdn.com/za.svg', isoCode: 'za' },
    { code: '+971', name: 'United Arab Emirates', flag: 'https://flagcdn.com/ae.svg', isoCode: 'ae' },
    { code: '+966', name: 'Saudi Arabia', flag: 'https://flagcdn.com/sa.svg', isoCode: 'sa' },
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/eg.svg', isoCode: 'eg' },
    { code: '+234', name: 'Nigeria', flag: 'https://flagcdn.com/ng.svg', isoCode: 'ng' },
    { code: '+254', name: 'Kenya', flag: 'https://flagcdn.com/ke.svg', isoCode: 'ke' },
    { code: '+212', name: 'Morocco', flag: 'https://flagcdn.com/ma.svg', isoCode: 'ma' },
];

export default function AccountPage() {
    const { t } = useLanguage();

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Signup state
    const [signupEmail, setSignupEmail] = useState('');
    const [signupFirstName, setSignupFirstName] = useState('');
    const [signupLastName, setSignupLastName] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+230');
    const [newsletter, setNewsletter] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const countryDropdownRef = useRef<HTMLDivElement>(null);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.code.includes(countrySearch)
    );

    const selectedCountry = countries.find(c => c.code === countryCode) || countries[0];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
                setShowCountryDropdown(false);
                setCountrySearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login:', { loginEmail, loginPassword, rememberMe });
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Signup:', { signupEmail, signupFirstName, signupLastName, signupPhone: countryCode + signupPhone });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Login / Signup Section */}
            <div className="w-full bg-white pt-16 pb-4 px-4">
                <div className="w-full max-w-[1100px] mx-auto flex flex-col md:flex-row gap-6 items-stretch justify-evenly">

                    {/* ── LOGIN CARD ── */}
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgba(17,43,56,0.12)] px-14 py-14 flex flex-col">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Log In</h2>

                        <form onSubmit={handleLogin} className="flex flex-col gap-6 flex-1 justify-between">
                            {/* Email */}
                            <input
                                type="text"
                                placeholder="Email / Username"
                                value={loginEmail}
                                onChange={e => setLoginEmail(e.target.value)}
                                className="w-full h-[46px] px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#112b38]"
                                required
                            />

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showLoginPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    className="w-full h-[46px] px-4 pr-10 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#112b38]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Remember me + Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 accent-[#112b38]"
                                    />
                                    Remember me
                                </label>
                                <button type="button" className="text-[#c89c6b] hover:underline text-xs">
                                    Forgot password?
                                </button>
                            </div>

                            {/* LOGIN button */}
                            <button
                                type="submit"
                                className="w-full h-[46px] bg-transparent border-2 border-[#c89c6b] text-[#112b38] hover:bg-[#112b38] hover:text-white hover:border-[#112b38] font-bold rounded tracking-widest text-sm transition-all duration-300"
                            >
                                LOGIN
                            </button>

                            {/* OR divider */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-gray-300" />
                                <span className="text-sm font-bold text-gray-600">OR</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>

                            {/* Social */}
                            <p className="text-center text-xs text-gray-500">Login / Sign up with Social Media</p>
                            <div className="flex items-center justify-center gap-6 mt-1">
                                <button
                                    type="button"
                                    className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center shadow-sm">
                                        <FaFacebook size={28} className="text-[#1877f2]" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide">FACEBOOK</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center shadow-sm">
                                        <FcGoogle size={28} />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide">GOOGLE</span>
                                </button>
                            </div>
                        </form>
                    </div>



                    {/* ── SIGN UP CARD ── */}
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgba(200,156,107,0.15)] px-14 py-14 flex flex-col">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>

                        <form onSubmit={handleSignup} className="flex flex-col gap-6 flex-1 justify-between">
                            {/* Email */}
                            <input
                                type="email"
                                placeholder="Email / Username"
                                value={signupEmail}
                                onChange={e => setSignupEmail(e.target.value)}
                                className="w-full h-[46px] px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#112b38]"
                                required
                            />

                            {/* First Name */}
                            <input
                                type="text"
                                placeholder="First Name"
                                value={signupFirstName}
                                onChange={e => setSignupFirstName(e.target.value)}
                                className="w-full h-[46px] px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#112b38]"
                                required
                            />

                            {/* Last Name */}
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={signupLastName}
                                onChange={e => setSignupLastName(e.target.value)}
                                className="w-full h-[46px] px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#112b38]"
                                required
                            />

                            {/* Phone Number with country code */}
                            <div className="flex gap-2">
                                <div className="relative" ref={countryDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="h-[46px] px-3 border border-gray-300 rounded text-sm focus:outline-none flex items-center gap-1.5 bg-white min-w-[80px]"
                                    >
                                        <img
                                            src={selectedCountry.flag}
                                            alt={selectedCountry.name}
                                            className="w-5 h-3.5 object-cover rounded"
                                        />
                                        <span className="text-xs">{selectedCountry.code}</span>
                                    </button>

                                    {showCountryDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-20">
                                            <div className="sticky top-0 bg-white p-2 border-b">
                                                <input
                                                    type="text"
                                                    placeholder="Search country..."
                                                    value={countrySearch}
                                                    onChange={e => setCountrySearch(e.target.value)}
                                                    className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                            {filteredCountries.map(country => (
                                                <button
                                                    key={`${country.isoCode}-${country.code}`}
                                                    type="button"
                                                    onClick={() => {
                                                        setCountryCode(country.code);
                                                        setShowCountryDropdown(false);
                                                        setCountrySearch('');
                                                    }}
                                                    className={`w-full px-3 py-1.5 text-left hover:bg-gray-100 flex items-center gap-2 text-xs ${country.code === countryCode ? 'bg-blue-50' : ''}`}
                                                >
                                                    <img src={country.flag} alt={country.name} className="w-5 h-3.5 object-cover rounded" />
                                                    <span className="flex-1">{country.name}</span>
                                                    <span className="text-gray-500">{country.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={signupPhone}
                                    onChange={e => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 h-[46px] px-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#112b38]"
                                    maxLength={15}
                                />
                            </div>

                            {/* Newsletter checkbox */}
                            <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-500 leading-relaxed">
                                <input
                                    type="checkbox"
                                    checked={newsletter}
                                    onChange={e => setNewsletter(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 accent-[#112b38] flex-shrink-0"
                                />
                                Yes! I would like to receive special offers, promotion and other information from Deals.mu.
                            </label>

                            {/* SIGN UP button */}
                            <button
                                type="submit"
                                className="w-full h-[46px] bg-transparent border-2 border-[#c89c6b] text-[#112b38] hover:bg-[#112b38] hover:text-white hover:border-[#112b38] font-bold rounded tracking-widest text-sm transition-all duration-300"
                            >
                                SIGN UP
                            </button>

                            {/* OR divider */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-gray-300" />
                                <span className="text-sm font-bold text-gray-600">OR</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>

                            {/* Social */}
                            <p className="text-center text-xs text-gray-500">Login / Sign up with Social Media</p>
                            <div className="flex items-center justify-center gap-6 mt-1">
                                <button
                                    type="button"
                                    className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center shadow-sm">
                                        <FaFacebook size={28} className="text-[#1877f2]" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide">FACEBOOK</span>
                                </button>
                                <button
                                    type="button"
                                    className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 h-12 border border-gray-200 rounded flex items-center justify-center shadow-sm">
                                        <FcGoogle size={28} />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide">GOOGLE</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
