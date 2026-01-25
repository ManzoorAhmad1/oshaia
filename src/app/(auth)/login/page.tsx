'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import CountryDropdown from '@/components/CountryDropdown';
import { Text } from 'rizzui/typography';

export default function SignupPage() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+230');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = (e: any) => {
        e.preventDefault();
        console.log({
            mobileNumber: countryCode + mobileNumber,
            email,
            fullName,
            password
        });
    };

    return (
        <div className="w-full flex items-center justify-center flex-col overflow-hidden">
            {/* Header Image - Full Width */}
            <div className="w-full h-[320px] overflow-hidden flex items-center justify-center">
                <img
                    src='/images/Payment Graphic.jpg.jpeg'
                    alt='signup header'
                    className='w-full h-full object-contain'
                />
            </div>

            {/* Form Container */}
            <div className="w-full md:w-[70%] lg:w-[51.5%] px-4">
                <div className="bg-white  p-8 border border-gray-200 shadow-md">
                    <Text className="text-2xl text-black font-bold text-center mb-2">
                        Enter Your Email & Password
                    </Text>
                    <Text className="mb-6 text-sm text-gray-600 text-center">
                        If you don't have an account yet, we'll create one for you
                    </Text>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            <Link href="/forgot-password" className="text-xs text-gray-600 hover:text-purple-600 mt-1 inline-block">
                                Lost your password?
                            </Link>
                        </div>

                        {/* Sign in with Google */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                            <span>Sign in with</span>
                            <button type="button" className="flex items-center justify-center">
                                <FcGoogle size={24} />
                            </button>
                        </div>

                        {/* Create Account Link */}
                        <div className="text-center text-sm">
                            <span className="text-gray-600">New here? </span>
                            <Link href="/signup" className="text-blue-500 hover:underline font-medium">
                                Create an account
                            </Link>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                        >
                            Continue
                        </button>

                        {/* Terms */}
                        <div className="text-center text-xs text-gray-500 mt-4">
                            By continuing, you agree to our{' '}
                            <Link href="/terms" className="text-gray-700 hover:underline">
                                Terms of Service
                            </Link>
                            {' '}
                            <Link href="/privacy" className="text-gray-700 hover:underline">
                                Privacy Policy
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}