"use client"

import React, { useState } from "react"

const NewsletterSection = () => {
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
                    Subscribe to the Newsletter
                </p>

                {/* Subscription Form */}
                    <form onSubmit={handleSubmit} className="flex gap-x-4">
                        <div className="">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-80 px-4 sm:px-6 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent text-sm sm:text-base"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-accent-orange hover:bg-orange-600 text-white font-bold px-6 sm:px-12 rounded-lg  transition-colors duration-300 whitespace-nowrap text-sm sm:text-base"
                        >
                            {isSubscribed ? "Subscribed! ✓" : "Submit"}
                        </button>
                    </form>
                </div>
        </div>
    )
}

export default NewsletterSection