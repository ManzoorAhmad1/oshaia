"use client"

import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"

const NewsletterSection = () => {
    const { t } = useLanguage()
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            console.log("Subscribed with email:", email)
            setIsSubscribed(true)
            setEmail("")
            // Reset subscription status after 3 seconds
            setTimeout(() => setIsSubscribed(false), 3000)
        }
    }

    return (
        <div className="w-full bg-black h-[121.2px] flex items-center">
            <div className="w-full flex items-center justify-around">
                {/* Title */}
                <p className="text-2xl text-white">
                    {t.subscribeToNewsletter}
                </p>

                {/* Subscription Form */}
                    <form onSubmit={handleSubmit} className="flex gap-x-4">
                        <div className="">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.yourEmailAddress}
                                className="w-64 px-3 sm:px-4 py-1.5 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#c89c6b] hover:bg-[#b8885a] text-white font-bold px-4 sm:px-6 py-1.5 rounded-lg transition-all duration-300 whitespace-nowrap text-sm hover:scale-105 shadow-md hover:shadow-lg"
                        >
                            {isSubscribed ? t.subscribed : t.submit}
                        </button>
                    </form>
                </div>
        </div>
    )
}

export default NewsletterSection