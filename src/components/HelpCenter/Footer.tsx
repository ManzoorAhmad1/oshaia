'use client';

import { useState } from 'react';
import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsTicketPerforated, 
  BsHeadset,
  BsApple,
  BsChatDotsFill
} from 'react-icons/bs';
import { FaPaypal } from 'react-icons/fa';
import { RiWhatsappFill } from 'react-icons/ri';
import SponsorsCarousel from './SponsorsCarousel';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setNewsletterMessage('Please enter your email address.');
      return;
    }
    setNewsletterMessage('Thanks! You are now subscribed.');
    setEmail('');
    setTimeout(() => setNewsletterMessage(''), 2500);
  };

  const features = [
    { icon: <BsShieldCheck className="text-2xl text-[#E85C0D]" />, title: 'Secure Checkout', desc: 'Fast & Safe Payment' },
    { icon: <BsLightningCharge className="text-2xl text-[#E85C0D]" />, title: 'Instant Confirmation', desc: 'Guaranteed Tickets' },
    { icon: <BsTicketPerforated className="text-2xl text-[#E85C0D]" />, title: 'Official Ticket Seller', desc: 'Trusted by 10k+ Users' },
    { icon: <BsHeadset className="text-2xl text-[#E85C0D]" />, title: '24/7 Support', desc: 'Reliable Assistance' },
  ];

  const categories = ['Concerts', 'Festivals', 'Clubbing', 'Theatre'];
  const forOrganizers = ['Event Management', 'Ticketing Services', 'Marketing', 'Add Event'];
  const services = ['Customer Support', 'Payment Methods', 'Venue Ticketing'];

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 mt-16">
      {/* Sponsors Section */}
      <SponsorsCarousel />

      {/* Newsletter Section */}
      <section className="bg-[#0a1326] text-white border-t border-gray-800 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h6 className="text-white font-extrabold tracking-tight text-lg">
            Subscribe to the Newsletter
          </h6>
          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto">
            <div className="flex overflow-hidden shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full md:w-[420px] h-10 px-3 bg-white text-[#0a1326] outline-none border border-slate-300 focus:border-[#E85C0D] focus:ring-2 focus:ring-[#E85C0D]/30 rounded-none"
                required
              />
              <button
                type="submit"
                className="h-10 px-4 bg-[#E85C0D] text-white font-semibold hover:bg-[#c74c00] transition"
              >
                Submit
              </button>
            </div>
            {newsletterMessage && (
              <p className={`text-xs mt-1 ${newsletterMessage.includes('Thanks') ? 'text-emerald-500' : 'text-red-500'}`}>
                {newsletterMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm ">
        {features.map((feature, index) => (
          <div key={index} className='flex flex-col items-center justify-center'>
            {feature.icon}
            <p className="font-semibold mt-2 text-gray-800">{feature.title}</p>
            <p className="text-gray-500 text-xs">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <h6 className="font-semibold text-gray-800">You choose how to pay</h6>
          <div className="flex items-center gap-5 text-3xl">
            <BsApple className="text-black" />
            <FaPaypal className="text-[#003087]" />
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BsTicketPerforated className="text-[#E85C0D] text-2xl" />
              <span className="font-extrabold text-lg text-gray-900">TicketWeb</span>
            </div>
            <p className="text-sm text-gray-500 leading-snug">
              Entertainment discovery and ticketing platform for your favorite events and shows.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h6 className="font-semibold text-gray-800 mb-3 uppercase tracking-wide text-sm">Categories</h6>
            <ul className="space-y-1 text-sm text-gray-600">
              {categories.map((category) => (
                <li key={category}>
                  <a href="#" className="hover:text-[#E85C0D] transition">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h6 className="font-semibold text-gray-800 mb-3 uppercase tracking-wide text-sm">For Organisers</h6>
            <ul className="space-y-1 text-sm text-gray-600">
              {forOrganizers.map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[#E85C0D] transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h6 className="font-semibold text-gray-800 mb-3 uppercase tracking-wide text-sm">Services</h6>
            <ul className="space-y-1 text-sm text-gray-600">
              {services.map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-[#E85C0D] transition">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h6 className="font-semibold text-gray-800 mb-3 uppercase tracking-wide text-sm">Need Help?</h6>
            <p className="text-sm text-gray-600 mb-2">Chat with us:</p>
            <a
              href="#"
              className="flex items-center gap-2 border border-[#E85C0D] text-[#E85C0D] hover:bg-[#E85C0D] hover:text-white text-sm px-3 py-2 rounded-md w-fit transition-all duration-200"
            >
              <RiWhatsappFill /> Chat Online
            </a>
            <p className="text-xs text-gray-500 mt-3">We accept</p>
            <div className="flex items-center gap-3 text-2xl mt-1">
              <BsApple className="text-black" />
              <FaPaypal className="text-[#003087]" />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-4 bg-gray-50">
        <p className="text-center text-sm text-gray-500">
          © 2026 <span className="font-semibold text-gray-800">TicketWeb</span> — All rights reserved.
        </p>
      </div>
    </footer>
  );
}