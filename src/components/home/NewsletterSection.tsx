"use client"

import React, { useState } from "react"
import toast from "react-hot-toast"
import { useLanguage } from "@/context/LanguageContext"
import { useCms } from "@/lib/useCms"
import api from "@/lib/api"

const NewsletterSection = () => {
    const { t, language } = useLanguage()
    const { text: cmsText } = useCms('home')
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const title = cmsText('newsletter', 'title', language as 'en' | 'fr') || t.subscribeToNewsletter

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        try {
            await api.post('/subscribers', { email })
            toast.success(t.subscribed || 'Subscribed successfully!')
            setIsSubscribed(true)
            setEmail("")
            setTimeout(() => setIsSubscribed(false), 3000)
        } catch (err: any) {
            const msg = err?.response?.data?.message
            if (msg === 'Already subscribed.') {
                toast.success(t.subscribed || 'Already subscribed!')
            } else {
                toast.error(msg || 'Subscription failed. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full bg-[#112b38] py-6 sm:py-8 flex items-center my-6 sm:my-8 md:my-10">
            <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-4 sm:gap-0 px-4 sm:px-6">
                {/* Title */}
                <p className="text-lg sm:text-xl md:text-2xl text-white text-center sm:text-left">
                    {title}
                </p>

                {/* Subscription Form */}
                <form onSubmit={handleSubmit} className="flex gap-x-2 sm:gap-x-4 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.yourEmailAddress}
                            className="w-full sm:w-64 px-3 sm:px-4 py-1.5 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#c89c6b] hover:bg-[#b8885a] text-white font-bold px-4 sm:px-6 py-1.5 rounded-lg transition-all duration-300 whitespace-nowrap text-sm hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                        {isLoading ? '...' : isSubscribed ? t.subscribed : t.submit}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default NewsletterSection