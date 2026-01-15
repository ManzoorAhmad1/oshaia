

import React from 'react';
import { CreditCard, Apple, MessageCircle } from 'lucide-react';

const PartnersSection = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-8 rounded-xl mt-12">
      <div className="max-w-5xl mx-auto">
        {/* Why buy with Platinumlist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-center">
          <div>
            <div className="mb-2 text-2xl">🔒</div>
            <div className="font-semibold">Secure Checkout</div>
            <div className="text-xs text-gray-500">Fast & Secured Payment</div>
          </div>
          <div>
            <div className="mb-2 text-2xl">⚡</div>
            <div className="font-semibold">Instant confirmation</div>
            <div className="text-xs text-gray-500">Refund guarantee options</div>
          </div>
          <div>
            <div className="mb-2 text-2xl">🎫</div>
            <div className="font-semibold">Official Ticket Seller</div>
            <div className="text-xs text-gray-500">Used by 10m+ people</div>
          </div>
          <div>
            <div className="mb-2 text-2xl">🕑</div>
            <div className="font-semibold">24/7 Customer Service</div>
            <div className="text-xs text-gray-500">Reliable after sales support</div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="font-semibold text-lg mb-2 sm:mb-0">You choose how to pay</div>
          <div className="flex gap-4 text-3xl text-gray-700">
            <CreditCard className="w-8 h-8" />
            <CreditCard className="w-8 h-8" />
            <CreditCard className="w-8 h-8" />
            <Apple className="w-8 h-8" />
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">Dubai Events Tickets</h2>
          <p className="text-gray-700 mb-2">
            Obviously, Dubai is not a dull city where guests need to look for entertainment and events. However, it is easy to get lost in a variety of offers. You may wonder how to figure out what the best entertainment places in Dubai you should visit.
          </p>
          <p className="text-gray-700 mb-2">
            We believe our upcoming events listing website can be handy for you to have suggestions and pick the activities that cater to your preferences, align with your budget, and fit into your schedule.
          </p>
          <p className="text-gray-700 mb-2">
            Platinumlist.net is a guide on entertainment services in Dubai (UAE) that can help you sort out what is going on in the city and make the right choice. We constantly keep track of the latest indoor entertainment, live leisure shows, concerts, and other fun in the region and immediately post them on our online event ticket booking website.
          </p>
          <p className="text-gray-700">
            We strive to provide Dubai visitors with the most engaging experience of the city as well as to be the cheapest place to buy concert tickets. Save time, money, and effort by buying event tickets at Platinumlist.net.
          </p>
        </div>

        {/* Footer-like Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-6 gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2 font-bold">
            <span className="bg-black text-white rounded p-2 text-lg">Platinumlist</span>
            <span className="font-normal">Entertainment discovery and monetisation platform.</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Do you have any questions?</span>
            <span>Please contact us</span>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium mt-1 hover:bg-green-200 transition">
              <MessageCircle className="w-5 h-5" /> Chat online
            </button>
          </div>
          <div>
            <div className="font-semibold mb-1">We accept</div>
            <div className="flex gap-3 text-2xl text-gray-700">
              <CreditCard className="w-8 h-8" />
              <Apple className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
