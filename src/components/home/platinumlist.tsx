import React from 'react';
import { CreditCard, Apple, MessageCircle, Shield, Zap, Ticket, Clock, ChevronRight } from 'lucide-react';

const Platinumlist = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 sm:px-8 rounded-2xl mt-12 shadow-lg">
      <div className="max-w-6xl mx-auto">
        {/* Why buy with Platinumlist */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {[
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Secure Checkout",
              desc: "Fast & Secured Payment",
              color: "text-blue-600"
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Instant Confirmation",
              desc: "Refund guarantee options",
              color: "text-green-600"
            },
            {
              icon: <Ticket className="w-8 h-8" />,
              title: "Official Ticket Seller",
              desc: "Used by 10m+ people",
              color: "text-purple-600"
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "24/7 Customer Service",
              desc: "Reliable after sales support",
              color: "text-orange-600"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
            >
              <div className={`mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <div className="font-bold text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors">
                {feature.title}
              </div>
              <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                {feature.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 mb-12 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold text-xl mb-4 sm:mb-0 text-gray-800">You choose how to pay</div>
            <div className="flex gap-6">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={`credit-${i}`}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                  <CreditCard className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
              <div className="p-3 bg-gray-50 rounded-lg hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 group cursor-pointer">
                <Apple className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-3"></div>
            <h2 className="text-3xl font-bold text-gray-900">Dubai Events Tickets</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium text-gray-900">Dubai</span> is a vibrant city where entertainment and events are abundant. With so many options available, it's easy to feel overwhelmed. How do you determine which entertainment venues in Dubai are worth your visit?
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our comprehensive events listing platform serves as your personal guide, helping you discover activities that match your preferences, budget, and schedule perfectly.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Platinumlist.net</span> is your ultimate entertainment companion in Dubai (UAE). We continuously monitor the latest indoor entertainment, live shows, concerts, and regional events, promptly updating our platform to ensure you never miss out on what's happening.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to provide visitors with the most engaging Dubai experiences while offering competitive pricing. Save time, money, and effort by booking your event tickets through Platinumlist.net.
            </p>
          </div>
        </div>

        {/* Footer-like Info */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl p-3 text-xl font-bold shadow-lg">
                  Platinumlist
                </div>
                <div className="hidden sm:block w-12 h-px bg-gradient-to-r from-gray-400 to-transparent"></div>
              </div>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Premier entertainment discovery and monetization platform, connecting millions with unforgettable experiences.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="font-semibold text-gray-800 mb-2">Need assistance?</div>
              <p className="text-gray-600 text-sm mb-4">Our support team is here to help</p>
              <button className="group flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5" />
                <span>Chat Online</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="font-semibold text-gray-800 mb-4">Accepted Payment Methods</div>
              <div className="flex gap-4">
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300">
                  <CreditCard className="w-8 h-8 text-gray-700" />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-900 hover:scale-105 transition-all duration-300">
                  <Apple className="w-8 h-8 text-gray-700 group-hover:text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>10+ Years of Trust • 10M+ Satisfied Customers • 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platinumlist;