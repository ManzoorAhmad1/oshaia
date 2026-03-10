'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import HeroCarousel from '@/components/home/HeroCarousel';
import Footer from '@/components/home/Footer';

const countryCodes = [
    // North America
    { code: '+1', name: 'United States', flag: 'https://flagcdn.com/us.svg', isoCode: 'us' },
    { code: '+1', name: 'Canada', flag: 'https://flagcdn.com/ca.svg', isoCode: 'ca' },
    { code: '+52', name: 'Mexico', flag: 'https://flagcdn.com/mx.svg', isoCode: 'mx' },
    // Europe
    { code: '+44', name: 'United Kingdom', flag: 'https://flagcdn.com/gb.svg', isoCode: 'gb' },
    { code: '+33', name: 'France', flag: 'https://flagcdn.com/fr.svg', isoCode: 'fr' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/de.svg', isoCode: 'de' },
    { code: '+39', name: 'Italy', flag: 'https://flagcdn.com/it.svg', isoCode: 'it' },
    { code: '+34', name: 'Spain', flag: 'https://flagcdn.com/es.svg', isoCode: 'es' },
    { code: '+7', name: 'Russia', flag: 'https://flagcdn.com/ru.svg', isoCode: 'ru' },
    { code: '+31', name: 'Netherlands', flag: 'https://flagcdn.com/nl.svg', isoCode: 'nl' },
    { code: '+41', name: 'Switzerland', flag: 'https://flagcdn.com/ch.svg', isoCode: 'ch' },
    { code: '+46', name: 'Sweden', flag: 'https://flagcdn.com/se.svg', isoCode: 'se' },
    { code: '+47', name: 'Norway', flag: 'https://flagcdn.com/no.svg', isoCode: 'no' },
    { code: '+45', name: 'Denmark', flag: 'https://flagcdn.com/dk.svg', isoCode: 'dk' },
    { code: '+358', name: 'Finland', flag: 'https://flagcdn.com/fi.svg', isoCode: 'fi' },
    { code: '+48', name: 'Poland', flag: 'https://flagcdn.com/pl.svg', isoCode: 'pl' },
    { code: '+420', name: 'Czech Republic', flag: 'https://flagcdn.com/cz.svg', isoCode: 'cz' },
    { code: '+43', name: 'Austria', flag: 'https://flagcdn.com/at.svg', isoCode: 'at' },
    { code: '+32', name: 'Belgium', flag: 'https://flagcdn.com/be.svg', isoCode: 'be' },
    { code: '+351', name: 'Portugal', flag: 'https://flagcdn.com/pt.svg', isoCode: 'pt' },
    { code: '+30', name: 'Greece', flag: 'https://flagcdn.com/gr.svg', isoCode: 'gr' },
    { code: '+353', name: 'Ireland', flag: 'https://flagcdn.com/ie.svg', isoCode: 'ie' },
    { code: '+381', name: 'Serbia', flag: 'https://flagcdn.com/rs.svg', isoCode: 'rs' },
    { code: '+386', name: 'Slovenia', flag: 'https://flagcdn.com/si.svg', isoCode: 'si' },
    { code: '+421', name: 'Slovakia', flag: 'https://flagcdn.com/sk.svg', isoCode: 'sk' },
    { code: '+385', name: 'Croatia', flag: 'https://flagcdn.com/hr.svg', isoCode: 'hr' },
    { code: '+40', name: 'Romania', flag: 'https://flagcdn.com/ro.svg', isoCode: 'ro' },
    { code: '+36', name: 'Hungary', flag: 'https://flagcdn.com/hu.svg', isoCode: 'hu' },
    { code: '+380', name: 'Ukraine', flag: 'https://flagcdn.com/ua.svg', isoCode: 'ua' },
    { code: '+370', name: 'Lithuania', flag: 'https://flagcdn.com/lt.svg', isoCode: 'lt' },
    { code: '+371', name: 'Latvia', flag: 'https://flagcdn.com/lv.svg', isoCode: 'lv' },
    { code: '+372', name: 'Estonia', flag: 'https://flagcdn.com/ee.svg', isoCode: 'ee' },
    { code: '+373', name: 'Moldova', flag: 'https://flagcdn.com/md.svg', isoCode: 'md' },
    { code: '+374', name: 'Armenia', flag: 'https://flagcdn.com/am.svg', isoCode: 'am' },
    { code: '+375', name: 'Belarus', flag: 'https://flagcdn.com/by.svg', isoCode: 'by' },
    { code: '+376', name: 'Andorra', flag: 'https://flagcdn.com/ad.svg', isoCode: 'ad' },
    { code: '+377', name: 'Monaco', flag: 'https://flagcdn.com/mc.svg', isoCode: 'mc' },
    { code: '+382', name: 'Montenegro', flag: 'https://flagcdn.com/me.svg', isoCode: 'me' },
    { code: '+383', name: 'Kosovo', flag: 'https://flagcdn.com/xk.svg', isoCode: 'xk' },
    { code: '+387', name: 'Bosnia and Herzegovina', flag: 'https://flagcdn.com/ba.svg', isoCode: 'ba' },
    { code: '+389', name: 'North Macedonia', flag: 'https://flagcdn.com/mk.svg', isoCode: 'mk' },
    // Asia
    { code: '+86', name: 'China', flag: 'https://flagcdn.com/cn.svg', isoCode: 'cn' },
    { code: '+91', name: 'India', flag: 'https://flagcdn.com/in.svg', isoCode: 'in' },
    { code: '+81', name: 'Japan', flag: 'https://flagcdn.com/jp.svg', isoCode: 'jp' },
    { code: '+82', name: 'South Korea', flag: 'https://flagcdn.com/kr.svg', isoCode: 'kr' },
    { code: '+66', name: 'Thailand', flag: 'https://flagcdn.com/th.svg', isoCode: 'th' },
    { code: '+65', name: 'Singapore', flag: 'https://flagcdn.com/sg.svg', isoCode: 'sg' },
    { code: '+60', name: 'Malaysia', flag: 'https://flagcdn.com/my.svg', isoCode: 'my' },
    { code: '+63', name: 'Philippines', flag: 'https://flagcdn.com/ph.svg', isoCode: 'ph' },
    { code: '+62', name: 'Indonesia', flag: 'https://flagcdn.com/id.svg', isoCode: 'id' },
    { code: '+84', name: 'Vietnam', flag: 'https://flagcdn.com/vn.svg', isoCode: 'vn' },
    { code: '+880', name: 'Bangladesh', flag: 'https://flagcdn.com/bd.svg', isoCode: 'bd' },
    { code: '+92', name: 'Pakistan', flag: 'https://flagcdn.com/pk.svg', isoCode: 'pk' },
    { code: '+94', name: 'Sri Lanka', flag: 'https://flagcdn.com/lk.svg', isoCode: 'lk' },
    { code: '+98', name: 'Iran', flag: 'https://flagcdn.com/ir.svg', isoCode: 'ir' },
    { code: '+964', name: 'Iraq', flag: 'https://flagcdn.com/iq.svg', isoCode: 'iq' },
    { code: '+962', name: 'Jordan', flag: 'https://flagcdn.com/jo.svg', isoCode: 'jo' },
    { code: '+961', name: 'Lebanon', flag: 'https://flagcdn.com/lb.svg', isoCode: 'lb' },
    { code: '+966', name: 'Saudi Arabia', flag: 'https://flagcdn.com/sa.svg', isoCode: 'sa' },
    { code: '+971', name: 'United Arab Emirates', flag: 'https://flagcdn.com/ae.svg', isoCode: 'ae' },
    { code: '+972', name: 'Israel', flag: 'https://flagcdn.com/il.svg', isoCode: 'il' },
    { code: '+90', name: 'Turkey', flag: 'https://flagcdn.com/tr.svg', isoCode: 'tr' },
    { code: '+960', name: 'Maldives', flag: 'https://flagcdn.com/mv.svg', isoCode: 'mv' },
    { code: '+963', name: 'Syria', flag: 'https://flagcdn.com/sy.svg', isoCode: 'sy' },
    { code: '+965', name: 'Kuwait', flag: 'https://flagcdn.com/kw.svg', isoCode: 'kw' },
    { code: '+967', name: 'Yemen', flag: 'https://flagcdn.com/ye.svg', isoCode: 'ye' },
    { code: '+968', name: 'Oman', flag: 'https://flagcdn.com/om.svg', isoCode: 'om' },
    { code: '+973', name: 'Bahrain', flag: 'https://flagcdn.com/bh.svg', isoCode: 'bh' },
    { code: '+974', name: 'Qatar', flag: 'https://flagcdn.com/qa.svg', isoCode: 'qa' },
    { code: '+977', name: 'Nepal', flag: 'https://flagcdn.com/np.svg', isoCode: 'np' },
    { code: '+994', name: 'Azerbaijan', flag: 'https://flagcdn.com/az.svg', isoCode: 'az' },
    { code: '+995', name: 'Georgia', flag: 'https://flagcdn.com/ge.svg', isoCode: 'ge' },
    { code: '+998', name: 'Uzbekistan', flag: 'https://flagcdn.com/uz.svg', isoCode: 'uz' },
    // Africa
    { code: '+20', name: 'Egypt', flag: 'https://flagcdn.com/eg.svg', isoCode: 'eg' },
    { code: '+27', name: 'South Africa', flag: 'https://flagcdn.com/za.svg', isoCode: 'za' },
    { code: '+212', name: 'Morocco', flag: 'https://flagcdn.com/ma.svg', isoCode: 'ma' },
    { code: '+213', name: 'Algeria', flag: 'https://flagcdn.com/dz.svg', isoCode: 'dz' },
    { code: '+216', name: 'Tunisia', flag: 'https://flagcdn.com/tn.svg', isoCode: 'tn' },
    { code: '+221', name: 'Senegal', flag: 'https://flagcdn.com/sn.svg', isoCode: 'sn' },
    { code: '+225', name: "Côte d'Ivoire", flag: 'https://flagcdn.com/ci.svg', isoCode: 'ci' },
    { code: '+230', name: 'Mauritius', flag: 'https://flagcdn.com/mu.svg', isoCode: 'mu' },
    { code: '+233', name: 'Ghana', flag: 'https://flagcdn.com/gh.svg', isoCode: 'gh' },
    { code: '+234', name: 'Nigeria', flag: 'https://flagcdn.com/ng.svg', isoCode: 'ng' },
    { code: '+237', name: 'Cameroon', flag: 'https://flagcdn.com/cm.svg', isoCode: 'cm' },
    { code: '+248', name: 'Seychelles', flag: 'https://flagcdn.com/sc.svg', isoCode: 'sc' },
    { code: '+250', name: 'Rwanda', flag: 'https://flagcdn.com/rw.svg', isoCode: 'rw' },
    { code: '+251', name: 'Ethiopia', flag: 'https://flagcdn.com/et.svg', isoCode: 'et' },
    { code: '+254', name: 'Kenya', flag: 'https://flagcdn.com/ke.svg', isoCode: 'ke' },
    { code: '+255', name: 'Tanzania', flag: 'https://flagcdn.com/tz.svg', isoCode: 'tz' },
    { code: '+256', name: 'Uganda', flag: 'https://flagcdn.com/ug.svg', isoCode: 'ug' },
    { code: '+258', name: 'Mozambique', flag: 'https://flagcdn.com/mz.svg', isoCode: 'mz' },
    { code: '+260', name: 'Zambia', flag: 'https://flagcdn.com/zm.svg', isoCode: 'zm' },
    { code: '+261', name: 'Madagascar', flag: 'https://flagcdn.com/mg.svg', isoCode: 'mg' },
    { code: '+263', name: 'Zimbabwe', flag: 'https://flagcdn.com/zw.svg', isoCode: 'zw' },
    { code: '+264', name: 'Namibia', flag: 'https://flagcdn.com/na.svg', isoCode: 'na' },
    { code: '+267', name: 'Botswana', flag: 'https://flagcdn.com/bw.svg', isoCode: 'bw' },
    // South America
    { code: '+54', name: 'Argentina', flag: 'https://flagcdn.com/ar.svg', isoCode: 'ar' },
    { code: '+55', name: 'Brazil', flag: 'https://flagcdn.com/br.svg', isoCode: 'br' },
    { code: '+56', name: 'Chile', flag: 'https://flagcdn.com/cl.svg', isoCode: 'cl' },
    { code: '+57', name: 'Colombia', flag: 'https://flagcdn.com/co.svg', isoCode: 'co' },
    { code: '+58', name: 'Venezuela', flag: 'https://flagcdn.com/ve.svg', isoCode: 've' },
    { code: '+593', name: 'Ecuador', flag: 'https://flagcdn.com/ec.svg', isoCode: 'ec' },
    { code: '+595', name: 'Paraguay', flag: 'https://flagcdn.com/py.svg', isoCode: 'py' },
    { code: '+598', name: 'Uruguay', flag: 'https://flagcdn.com/uy.svg', isoCode: 'uy' },
    // Oceania
    { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/au.svg', isoCode: 'au' },
    { code: '+64', name: 'New Zealand', flag: 'https://flagcdn.com/nz.svg', isoCode: 'nz' },
    { code: '+675', name: 'Papua New Guinea', flag: 'https://flagcdn.com/pg.svg', isoCode: 'pg' },
    { code: '+679', name: 'Fiji', flag: 'https://flagcdn.com/fj.svg', isoCode: 'fj' },
];

const regions = ['Africa', 'Asia', 'Europe', 'Middle East', 'North America', 'Oceania', 'South America'];

const countries = [
    'Mauritius', 'United States', 'United Kingdom', 'France', 'Germany',
    'India', 'United Arab Emirates', 'Saudi Arabia', 'Australia', 'Canada',
];

const interests = [
    'Hotel Accommodation', 'Villa Accommodation', 'Day Packages', 'Room Day Use',
    'Evening Packages', 'Restaurant Deals', 'Spa Deals', 'Beauty Treatments',
    'Event Deals', 'Activity Deals', 'Rodrigues Deals', 'Luxury Accommodation',
    'Budget Accommodation', 'Apartment Accommodation', 'Lodges Accommodation',
];

const bookingFrequencies = [
    'First time', 'Once a year', 'Twice a year', '3-5 times a year', 'More than 5 times a year',
];

// Collapsible section wrapper
function Section({
    title,
    open,
    onToggle,
    children,
}: {
    title: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-5">
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
                <span className="text-sm font-bold tracking-widest text-[#112b38] uppercase">
                    {title}
                </span>
                <ChevronDown
                    size={18}
                    className={`text-[#112b38] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-6 pb-6 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
}

// Reusable label + small input label component
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="block text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-1">
            {label}{required && ' *'}
        </label>
    );
}

const inputCls =
    'w-full h-[38px] px-3 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#112b38] focus:border-[#112b38]';

const saveBtnCls =
    'px-6 h-[34px] bg-[#c89c6b] hover:bg-[#112b38] text-white text-xs font-bold tracking-widest rounded transition-all duration-300';

export default function ProfilePage() {
    // Section open/close states
    const [openSections, setOpenSections] = useState({
        customer: true,
        additional: true,
        password: true,
        social: true,
    });

    const toggle = (key: keyof typeof openSections) =>
        setOpenSections((s) => ({ ...s, [key]: !s[key] }));

    // Customer Details
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('Havish');
    const [lastName, setLastName] = useState('ph');
    const [countryCode, setCountryCode] = useState('+230');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('mugonhavish94@gmail.com');
    const [showCountryDrop, setShowCountryDrop] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const countryRef = useRef<HTMLDivElement>(null);

    const filteredCodes = countryCodes.filter(
        (c) =>
            c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
            c.code.includes(countrySearch)
    );
    const selectedCode = countryCodes.find((c) => c.code === countryCode) || countryCodes[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
                setShowCountryDrop(false);
                setCountrySearch('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Additional Info
    const [gender, setGender] = useState('');
    const [dobDD, setDobDD] = useState('');
    const [dobMM, setDobMM] = useState('');
    const [dobYYYY, setDobYYYY] = useState('');
    const [region, setRegion] = useState('');
    const [country, setCountry] = useState('Mauritius');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [bookingFreq, setBookingFreq] = useState('');

    const toggleInterest = (item: string) =>
        setSelectedInterests((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );

    // Change Password
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <HeroCarousel />

            <div className="w-full max-w-2xl mx-auto px-4 py-10 mt-20">

                {/* ── CUSTOMER DETAILS ── */}
                <Section title="Customer Details" open={openSections.customer} onToggle={() => toggle('customer')}>
                    <div className="pt-4 space-y-4">
                        {/* Row 1: Title | First Name | Last Name */}
                        <div className="grid grid-cols-[90px_1fr_1fr] gap-3">
                            <div>
                                <FieldLabel label="Title" />
                                <select
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={inputCls}
                                >
                                    <option value="">Title</option>
                                    <option>Mr</option>
                                    <option>Mrs</option>
                                    <option>Ms</option>
                                    <option>Dr</option>
                                </select>
                            </div>
                            <div>
                                <FieldLabel label="First Name" required />
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={inputCls}
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <FieldLabel label="Last Name" required />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={inputCls}
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        {/* Row 2: Country Code | Phone */}
                        <div className="flex items-end gap-3">
                            <div className="w-[180px] flex-shrink-0">
                                <FieldLabel label="Country Code" />
                                <div className="relative" ref={countryRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDrop(!showCountryDrop)}
                                        className={`${inputCls} flex items-center justify-between px-3`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <img src={selectedCode.flag} alt="" className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0" />
                                            <span className="text-sm truncate">{selectedCode.name.split(' ')[0]} ({selectedCode.code})</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${showCountryDrop ? 'rotate-180' : ''}`} />
                                    </button>
                                    {showCountryDrop && (
                                        <div className="absolute top-full left-0 mt-1 w-64 max-h-52 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg z-20">
                                            <div className="sticky top-0 bg-white p-2 border-b">
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    className="w-full h-8 px-3 border border-gray-300 rounded text-sm focus:outline-none"
                                                    autoFocus
                                                />
                                            </div>
                                            {filteredCodes.map((c) => (
                                                <button
                                                    key={c.isoCode + c.code}
                                                    type="button"
                                                    onClick={() => { setCountryCode(c.code); setShowCountryDrop(false); setCountrySearch(''); }}
                                                    className={`w-full px-3 py-1.5 flex items-center gap-2 text-xs hover:bg-gray-50 text-left ${c.code === countryCode ? 'bg-[#112b38]/5' : ''}`}
                                                >
                                                    <img src={c.flag} alt="" className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0" />
                                                    <span className="flex-1 whitespace-nowrap">{c.name}</span>
                                                    <span className="text-gray-400 whitespace-nowrap">{c.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <FieldLabel label="Phone Number" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="Phone Number"
                                    className={inputCls}
                                    maxLength={15}
                                />
                            </div>
                        </div>

                        {/* Row 3: Email */}
                        <div>
                            <FieldLabel label="Email Address" required />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className={inputCls}
                            />
                        </div>

                        <p className="text-[11px] text-gray-400 leading-relaxed">
                            Note: Your phone number and/or email address will be used to send you the rewards, offers and order details etc.
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1">
                            <button type="button" className={saveBtnCls}>Save</button>
                            <button type="button" className="text-xs text-[#112b38] hover:text-[#c89c6b] hover:underline transition-colors">
                                Enter Company Details (optional)
                            </button>
                        </div>
                    </div>
                </Section>

                {/* ── ADDITIONAL INFORMATION ── */}
                <Section title="Additional Information" open={openSections.additional} onToggle={() => toggle('additional')}>
                    <div className="pt-4 space-y-4">
                        {/* Row: Gender | DOB */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel label="Gender" />
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className={inputCls}
                                >
                                    <option value="">Gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <FieldLabel label="Date of Birth" />
                                <div className="grid grid-cols-3 gap-2">
                                    <input
                                        type="text"
                                        placeholder="DD"
                                        maxLength={2}
                                        value={dobDD}
                                        onChange={(e) => setDobDD(e.target.value.replace(/\D/g, ''))}
                                        className={inputCls + ' text-center'}
                                    />
                                    <input
                                        type="text"
                                        placeholder="MM"
                                        maxLength={2}
                                        value={dobMM}
                                        onChange={(e) => setDobMM(e.target.value.replace(/\D/g, ''))}
                                        className={inputCls + ' text-center'}
                                    />
                                    <input
                                        type="text"
                                        placeholder="YYYY"
                                        maxLength={4}
                                        value={dobYYYY}
                                        onChange={(e) => setDobYYYY(e.target.value.replace(/\D/g, ''))}
                                        className={inputCls + ' text-center'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row: Region | Country */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel label="Region" />
                                <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputCls}>
                                    <option value="">Region</option>
                                    {regions.map((r) => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <FieldLabel label="Country" />
                                <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
                                    {countries.map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <p className="text-[11px] font-bold tracking-widest text-gray-700 uppercase mb-1">
                                What are you most interested in?
                            </p>
                            <p className="text-[11px] text-gray-400 mb-3">
                                Let us know in which deals you are interested so we can send details on special offers, last minute deals and flash sales.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                {interests.map((item) => (
                                    <label key={item} className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={selectedInterests.includes(item)}
                                            onChange={() => toggleInterest(item)}
                                            className="w-3.5 h-3.5 accent-[#c89c6b] flex-shrink-0"
                                        />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Booking Frequency */}
                        <div>
                            <FieldLabel label="How often do you book for overnight stay or leisure related packages?" />
                            <select value={bookingFreq} onChange={(e) => setBookingFreq(e.target.value)} className={`${inputCls} w-48`}>
                                <option value="">Select</option>
                                {bookingFrequencies.map((f) => <option key={f}>{f}</option>)}
                            </select>
                        </div>

                        <button type="button" className={saveBtnCls}>Save</button>
                    </div>
                </Section>

                {/* ── CHANGE PASSWORD ── */}
                <Section title="Change Password" open={openSections.password} onToggle={() => toggle('password')}>
                    <div className="pt-4 space-y-4">
                        <div>
                            <FieldLabel label="Current Password" />
                            <div className="relative">
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    value={currentPwd}
                                    onChange={(e) => setCurrentPwd(e.target.value)}
                                    className={inputCls + ' pr-10'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FieldLabel label="New Password" />
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={newPwd}
                                        onChange={(e) => setNewPwd(e.target.value)}
                                        className={inputCls + ' pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <FieldLabel label="Confirm New Password" />
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPwd}
                                        onChange={(e) => setConfirmPwd(e.target.value)}
                                        className={inputCls + ' pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button type="button" className={saveBtnCls}>Save</button>
                    </div>
                </Section>

                {/* ── MY SOCIAL LOGIN ACCOUNTS ── */}
                <Section title="My Social Login Accounts" open={openSections.social} onToggle={() => toggle('social')}>
                    <div className="pt-4 space-y-2">
                        <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-3">
                            Link Your Social Media Accounts
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Facebook */}
                            <button
                                type="button"
                                className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded hover:border-[#1877f2] hover:bg-blue-50 transition-all duration-200 flex-1 justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <FaFacebook size={20} className="text-[#1877f2]" />
                                    <span className="text-xs font-semibold text-gray-700 tracking-wide">FACEBOOK</span>
                                </div>
                                <span className="text-xs text-[#1877f2] font-medium hover:underline">Link</span>
                            </button>

                            {/* Google */}
                            <button
                                type="button"
                                className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded hover:border-[#c89c6b] hover:bg-orange-50 transition-all duration-200 flex-1 justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <FcGoogle size={20} />
                                    <span className="text-xs font-semibold text-gray-700 tracking-wide">GOOGLE</span>
                                </div>
                                <span className="text-xs text-[#c89c6b] font-medium hover:underline">Link</span>
                            </button>
                        </div>
                    </div>
                </Section>

            </div>

            <Footer />
        </div>
    );
}
