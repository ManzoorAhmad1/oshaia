'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronDown, ChevronUp,
    Calendar, Clock, MapPin, Mail, Phone,
    CreditCard, Ticket, ShieldCheck, Timer
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import NavSearchHeader from '@/components/event/NavSearchHeader';
import { useAuth } from '@/context/AuthContext';
import { useCms } from '@/lib/useCms';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUrl';
import toast from 'react-hot-toast';

interface ApiEvent {
    _id: string;
    title: { en: string; fr: string };
    startDate: string;
    startTime?: string;
    venue: { en: string; fr: string };
    coverImage?: string;
    bannerSquare?: string;
    bannerLandscape?: string;
    ticketTypes: Array<{ name: { en: string; fr: string } | string; price: number; processingFee?: number; discount?: number; discountType?: 'flat' | 'percent'; totalSeats?: number; availableSeats?: number; quantity?: number; sold?: number; buy1Get1?: boolean }>;
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { get: getCms } = useCms('checkout');
    const [event, setEvent] = useState<ApiEvent | null>(null);
    const [selectedTicketIdx, setSelectedTicketIdx] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState<'card' | 'juice' | 'mytblink' | null>(null);
    const [summaryOpen, setSummaryOpen] = useState(true);
    const [timeLeft, setTimeLeft] = useState(13 * 60 - 1);
    const [qty, setQty] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth guard
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace(`/account?redirect=/event/${params.id}/checkout`);
        }
    }, [authLoading, isAuthenticated, params.id, router]);

    // Fetch event
    useEffect(() => {
        api.get(`/events/${params.id}`)
            .then(res => setEvent(res.data.data?.event ?? res.data.event ?? null))
            .catch(() => {});
    }, [params.id]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
    };

    const getImageSrc = (ev: ApiEvent) => getImageUrl(ev.bannerSquare || ev.bannerLandscape || ev.coverImage);
    const cmsImage = getCms('banner')?.image || '';
    const deliveryCms = getCms('delivery');
    const deliveryText = deliveryCms?.description?.en || 'Once your purchase is complete, you will receive your tickets 24 hours before the event at:';
    const rulesLinkText = deliveryCms?.buttonText?.en || 'the Rules and Regulations of the venue';
    const rulesLinkUrl = deliveryCms?.buttonLink || '/terms';

    const selectedTicket = event?.ticketTypes?.[selectedTicketIdx];
    const ticketPrice = selectedTicket?.price ?? 0;
    const processingFee = selectedTicket?.processingFee ?? 0;
    const discountAmt = (() => {
        const d = selectedTicket?.discount ?? 0;
        if (!d) return 0;
        return selectedTicket?.discountType === 'percent'
            ? ticketPrice * (d / 100)
            : d;
    })();
    const discountedPrice = Math.max(0, ticketPrice - discountAmt);
    const subtotal = discountedPrice * qty;
    const total = subtotal + processingFee;

    const handlePayNow = async () => {
        if (!selectedPayment || !agreed) return;
        setIsSubmitting(true);
        try {
            await api.post('/bookings', {
                eventId: params.id,
                ticketTypeIndex: selectedTicketIdx,
                quantity: qty,
                buyerName: user?.name || '',
                buyerEmail: user?.email || '',
                buyerPhone: (user as any)?.phone || null,
            });
            toast.success('Booking confirmed! Your tickets will be sent to your email.');
            router.push('/profile?tab=tickets');
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Booking failed. Please try again.';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <NavSearchHeader />

            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#112b38] transition-colors mb-6 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="font-medium">Check out</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">

                    {/* ===== LEFT COLUMN ===== */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Event Image Card */}
                        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
                            <div className="relative w-full h-[200px] sm:h-[230px] bg-gray-100">
                                {(event && getImageSrc(event)) || cmsImage ? (
                                    <img
                                        src={(event ? getImageSrc(event) : null) || cmsImage}
                                        alt={event?.title?.en || 'Event'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-center text-gray-400">
                                            <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-xs">No image</p>
                                        </div>
                                    </div>
                                )}
                                {(event && getImageSrc(event) || cmsImage) && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                )}
                            </div>

                            {/* Event Info */}
                            <div className="p-4 space-y-2">
                                <h2 className="font-bold text-[#112b38] text-base sm:text-lg leading-tight">
                                    {event?.title?.en || event?.title?.fr || 'Event'}
                                </h2>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <MapPin className="w-3.5 h-3.5 text-[#c89c6b] flex-shrink-0" />
                                    <span>{event?.venue?.en || event?.venue?.fr || 'Venue'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-[#c89c6b] flex-shrink-0" />
                                        <span>{event ? formatDate(event.startDate) : ''}</span>
                                    </div>
                                    {event?.startTime && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-[#c89c6b] flex-shrink-0" />
                                        <span>{event.startTime}</span>
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-dashed border-gray-200 mx-4" />

                            {/* Ticket Row */}
                            <div className="px-4 py-3 flex items-center justify-between gap-3">
                                <div className="flex items-start gap-2">
                                    <Ticket className="w-4 h-4 text-[#c89c6b] mt-0.5 flex-shrink-0" />
                                    <div>
                                        {event?.ticketTypes && event.ticketTypes.length > 1 ? (
                                            <select
                                                value={selectedTicketIdx}
                                                onChange={e => setSelectedTicketIdx(Number(e.target.value))}
                                                className="text-sm font-semibold text-[#112b38] border border-gray-200 rounded px-2 py-1 bg-white"
                                            >
                                                {event.ticketTypes.map((tt, i) => (
                                                    <option key={i} value={i}>{typeof tt.name === 'object' ? tt.name.en : tt.name} — Rs {tt.price}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="font-semibold text-[#112b38] text-sm">
                                                {(typeof selectedTicket?.name === 'object' ? selectedTicket.name.en : selectedTicket?.name) || 'General Admission'}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-0.5">Rs {ticketPrice} / ticket</p>
                                    </div>
                                </div>

                                {/* Quantity control */}
                                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1 bg-gray-50">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#112b38] font-bold text-base transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-semibold text-[#112b38] min-w-[20px] text-center">
                                        x{qty}
                                    </span>
                                    <button
                                        onClick={() => setQty(q => Math.min(20, q + 1))}
                                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#112b38] font-bold text-base transition-colors"
                                    >
                                        +
                                    </button>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Ticket Delivery Method */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-4 h-4 text-[#c89c6b]" />
                                <h3 className="font-semibold text-[#112b38] text-sm">Ticket delivery method</h3>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {deliveryText}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs text-gray-600 font-medium">
                                <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-[#c89c6b]" />
                                    {user?.email || 'your email'}
                                </span>
                                {user?.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-[#c89c6b]" />
                                    {user.phone}
                                </span>
                                )}
                            </div>
                            <p className="text-xs pt-1">
                                <a href={rulesLinkUrl} className="text-[#c89c6b] hover:text-[#112b38] underline transition-colors">
                                    {rulesLinkText}
                                </a>
                                <span className="text-gray-400"> of event for customers</span>
                            </p>
                        </div>
                    </div>

                    {/* ===== RIGHT COLUMN ===== */}
                    <div className="lg:col-span-3 space-y-4">

                        {/* Payment Methods */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                            <h3 className="font-bold text-[#112b38] text-base sm:text-lg mb-4">
                                Select Your Payment Methods
                            </h3>

                            <div className="space-y-3">

                                {/* Card Option */}
                                <label
                                    className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${selectedPayment === 'card'
                                        ? 'border-[#c89c6b] bg-[#c89c6b]/5'
                                        : 'border-gray-200 hover:border-[#c89c6b]/50'
                                        }`}
                                    onClick={() => setSelectedPayment('card')}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Radio circle */}
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedPayment === 'card' ? 'border-[#c89c6b]' : 'border-gray-300'}`}>
                                            {selectedPayment === 'card' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#c89c6b]" />
                                            )}
                                        </div>

                                        {/* Card brand icons */}
                                        <div className="flex items-center gap-1.5">
                                            {/* Visa */}
                                            <div className="bg-[#1a1f71] text-white text-[9px] font-bold px-2 py-0.5 rounded italic tracking-wider">VISA</div>
                                            {/* Mastercard */}
                                            <div className="flex -space-x-1.5">
                                                <div className="w-5 h-5 rounded-full bg-[#EB001B] opacity-90" />
                                                <div className="w-5 h-5 rounded-full bg-[#F79E1B] opacity-90" />
                                            </div>
                                            {/* Amex */}
                                            <div className="bg-[#2E77BC] text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-tight">AMEX</div>
                                        </div>

                                        <span className="text-xs sm:text-sm text-gray-600">Add credit or debit cards</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${selectedPayment === 'card' ? 'rotate-180' : ''}`} />
                                </label>

                                {/* Card input fields - expanded */}
                                {selectedPayment === 'card' && (
                                    <div className="border border-[#c89c6b]/30 rounded-xl p-4 space-y-3 bg-[#c89c6b]/5">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Card Number</label>
                                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white gap-2">
                                                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                                                    maxLength={19}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM / YY"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#c89c6b] bg-white"
                                                    maxLength={7}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="000"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#c89c6b] bg-white"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                placeholder="Name on card"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#c89c6b] bg-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Juice Option */}
                                <label
                                    className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${selectedPayment === 'juice'
                                        ? 'border-[#c89c6b] bg-[#c89c6b]/5'
                                        : 'border-gray-200 hover:border-[#c89c6b]/50'
                                        }`}
                                    onClick={() => setSelectedPayment('juice')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedPayment === 'juice' ? 'border-[#c89c6b]' : 'border-gray-300'}`}>
                                            {selectedPayment === 'juice' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#c89c6b]" />
                                            )}
                                        </div>
                                        {/* Juice logo text */}
                                        <div className="flex items-center gap-1">
                                            <div className="bg-[#00A859] text-white text-xs font-black px-2.5 py-0.5 rounded-lg italic tracking-wide">juice</div>
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600">Juice by MCB</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${selectedPayment === 'juice' ? 'rotate-180' : ''}`} />
                                </label>

                                {/* MyT / Blink / MauCAS Option */}
                                <label
                                    className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${selectedPayment === 'mytblink'
                                        ? 'border-[#c89c6b] bg-[#c89c6b]/5'
                                        : 'border-gray-200 hover:border-[#c89c6b]/50'
                                        }`}
                                    onClick={() => setSelectedPayment('mytblink')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedPayment === 'mytblink' ? 'border-[#c89c6b]' : 'border-gray-300'}`}>
                                            {selectedPayment === 'mytblink' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#c89c6b]" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="bg-[#D51E49] text-white text-[9px] font-black px-2 py-0.5 rounded tracking-tight">MyT</div>
                                            <div className="bg-[#FF6B00] text-white text-[9px] font-black px-2 py-0.5 rounded tracking-tight">blink</div>
                                            <div className="bg-[#112b38] text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-tight">Mau<span className="text-[#c89c6b]">CAS</span></div>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${selectedPayment === 'mytblink' ? 'rotate-180' : ''}`} />
                                </label>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                            <h3 className="font-bold text-[#112b38] text-base sm:text-lg mb-1">
                                    {event?.title?.en || event?.title?.fr || 'Order Summary'}
                                </h3>

                            {/* Summary Toggle */}
                            <button
                                onClick={() => setSummaryOpen(o => !o)}
                                className="w-full flex items-center justify-between py-2 border-b border-gray-100 text-sm font-semibold text-gray-700 hover:text-[#112b38] transition-colors"
                            >
                                <span>Summary</span>
                                {summaryOpen
                                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                                }
                            </button>

                            {summaryOpen && (
                                <div className="space-y-2 pt-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Tickets</span>
                                        <span className="font-medium text-[#112b38]">Rs {(ticketPrice * qty).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Quantity</span>
                                        <span className="font-medium text-[#112b38]">{qty} ticket{qty > 1 ? 's' : ''}</span>
                                    </div>
                                    {selectedTicket?.buy1Get1 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                                🎁 Buy 1 Get 1 Free
                                            </span>
                                            <span className="font-bold text-green-600">+{qty} FREE</span>
                                        </div>
                                    )}
                                    {selectedTicket?.buy1Get1 && (
                                        <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 rounded-lg px-3 py-1.5">
                                            <span>Total tickets you receive</span>
                                            <span className="font-bold">{qty * 2} tickets</span>
                                        </div>
                                    )}
                                    {discountAmt > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">
                                                Discount{selectedTicket?.discountType === 'percent' ? ` (${selectedTicket.discount}%)` : ''}
                                            </span>
                                            <span className="font-medium text-green-600">- Rs {(discountAmt * qty).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Processing Fee</span>
                                        <span className="font-medium text-[#112b38]">Rs {processingFee}</span>
                                    </div>
                                    <div className="border-t border-dashed border-gray-200 pt-2 mt-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-700">Total excl. VAT</span>
                                        <span className="font-bold text-[#112b38] text-base">Rs {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Security badge */}
                        <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
                            <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>Your payment is secured with 256-bit SSL encryption</span>
                        </div>

                        {/* PAY NOW Button */}
                        <button
                            onClick={handlePayNow}
                            disabled={!selectedPayment || !agreed || isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all duration-300 ${selectedPayment && agreed && !isSubmitting
                                ? 'bg-[#112b38] hover:bg-[#1a3e52] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? 'Processing...' : 'PAY NOW'}
                        </button>

                        {/* Terms checkbox */}
                        <label className="flex items-center gap-2.5 cursor-pointer px-1">
                            <div
                                onClick={() => setAgreed(a => !a)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${agreed ? 'bg-[#c89c6b] border-[#c89c6b]' : 'border-gray-300 bg-white'}`}
                            >
                                {agreed && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-xs text-gray-600 text-center">
                                I have read and agreed to the terms and conditions.
                            </span>
                        </label>

                        {/* Time Remaining */}
                        <div className="flex items-center justify-center gap-2 py-1">
                            <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500' : 'text-[#c89c6b]'}`} />
                            <span className={`text-sm font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                                Time Remaining {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
