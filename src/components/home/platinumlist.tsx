import React from 'react';
import { CreditCard, Apple, MessageCircle, Shield, Zap, Ticket, Clock, ChevronRight } from 'lucide-react';

const Platinumlist = () => {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-8 rounded-xl sm:rounded-2xl mt-8 sm:mt-10 md:mt-12 shadow-lg">

      <div className="max-w-6xl mx-auto">
        <div>
          {/* Why buy with Platinumlist */}
          <p className='text-base sm:text-lg font-semibold mb-4 sm:mb-5 md:mb-6'>
            Why buy with Platinumlist?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {[
              {
                icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: "Secure Checkout",
                desc: "Fast & Secured Payment",
                color: "text-blue-600"
              },
              {
                icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: "Instant Confirmation",
                desc: "Refund guarantee options",
                color: "text-green-600"
              },
              {
                icon: <Ticket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: "Official Ticket Seller",
                desc: "Used by 10m+ people",
                color: "text-purple-600"
              },
              {
                icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: "24/7 Customer Service",
                desc: "Reliable after sales support",
                color: "text-orange-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="cursor-pointer flex items-center justify-center flex-col"
              >
                <div className={`mb-3 sm:mb-4 ${feature.color} text-center transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-gray-800  transition-colors">
                  {feature.title}
                </div>
                <div className="text-xs sm:text-sm text-gray-500  transition-colors">
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        {/* Payment Methods */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col">
            <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">You choose how to pay</div>
            <div className="flex gap-2">
              <div className="flex items-center justify-center   transition-shadow">
                <img
                  src='/images/1) - Juice MCB LOGO.png'
                  alt="Juice MCB"
                  className="h-8 sm:h-10 md:h-32 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center   transition-shadow">
                <img
                  src='/images/2) - emtel-blink-logo-500px.png'
                  alt="Emtel Blink"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center   transition-shadow">
                <img
                  src='/images/3) - Visa-Logo-2014.png'
                  alt="Visa"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center   transition-shadow">
                <img
                  src='/images/4) - Mastercard-logo.png'
                  alt="Mastercard"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center   transition-shadow">
                <img
                  src='/images/5) - maucas-logo-1024x263.png'
                  alt="Maucas"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
              </div>
              <div className="flex items-center justify-center   transition-shadow">
                <img
                  src='/images/6) - My.t Money .png'
                  alt="My.t Money"
                  className="h-8 sm:h-10 md:h-24 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Main Content */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
            <div className="w-1.5 sm:w-2 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Dubai Events Tickets</h2>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              <span className="font-medium text-gray-900">Dubai</span> is a vibrant city where entertainment and events are abundant. With so many options available, it's easy to feel overwhelmed. How do you determine which entertainment venues in Dubai are worth your visit?
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Our comprehensive events listing platform serves as your personal guide, helping you discover activities that match your preferences, budget, and schedule perfectly.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              <span className="font-semibold text-gray-900">Platinumlist.net</span> is your ultimate entertainment companion in Dubai (UAE). We continuously monitor the latest indoor entertainment, live shows, concerts, and regional events, promptly updating our platform to ensure you never miss out on what's happening.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Our mission is to provide visitors with the most engaging Dubai experiences while offering competitive pricing. Save time, money, and effort by booking your event tickets through Platinumlist.net.
            </p>
          </div>
        </div>

        {/* Footer-like Info */}
        <div className="border-t border-gray-200 pt-6 sm:pt-7 md:pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {/* Brand */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="bg-black text-white rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base md:text-lg font-semibold w-fit">
                Platinumlist
              </div>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base max-w-xs">
                entertainment discovery and monetization platform
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <div className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">Do you have any question?</div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Please contact us</p>
              <div className="group flex items-center gap-2 sm:gap-3 w-fit cursor-pointer">
                <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex-shrink-0" />
                <span className='border border-black px-3 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium hover:bg-gray-50 transition-colors'>Chat Online</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col">
              <div className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">We accept</div>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                <div className="flex items-center justify-center transition-colors">
                  <img
                    src='/images/1) - Juice MCB LOGO.png'
                    alt="Juice MCB"
                    className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                    src='/images/2) - emtel-blink-logo-500px.png'
                    alt="Emtel Blink"
                    className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center  transition-colors">
                  <img
                    src='/images/3) - Visa-Logo-2014.png'
                    alt="Visa"
                    className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                    src='/images/4) - Mastercard-logo.png'
                    alt="Mastercard"
                    className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center transition-colors">
                  <img
                    src='/images/5) - maucas-logo-1024x263.png'
                    alt="Maucas"
                    className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center  transition-colors">
                  <img
                    src='/images/6) - My.t Money .png'
                    alt="My.t Money"
                    className="h-12 w-16 sm:h-14 sm:w-20 lg:h-16 lg:w-24 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platinumlist;