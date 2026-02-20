'use client';

import React from 'react';
import { CreditCard, Apple, MessageCircle, Shield, Zap, Ticket, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FaWhatsapp } from 'react-icons/fa';

const Platinumlist = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-8 rounded-xl sm:rounded-2xl mt-4 sm:mt-5 md:mt-6 shadow-lg">

      <div className="max-w-6xl mx-auto">
        <div>
          {/* Why buy with Platinumlist */}
          <p className='text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-5'>
            {t.whyBuyWithUs}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
            {[
              {
                icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: t.secureCheckout,
                desc: t.fastSecuredPayment,
                color: "text-blue-600"
              },
              {
                icon: <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: t.instantConfirmation,
                desc: t.refundGuarantee,
                color: "text-green-600"
              },
              {
                icon: <Ticket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: t.officialTicketSeller,
                desc: t.usedByPeople,
                color: "text-purple-600"
              },
              {
                icon: <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
                title: t.customerService247,
                desc: t.reliableAfterSales,
                color: "text-orange-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="cursor-pointer flex  flex-col"
              >
                <div className={`mb-3 sm:mb-4 ${feature.color} flex- text-center transition-transform duration-300`}>
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
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col">
              <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">{t.youChooseHowToPay}</div>
              <div className="flex gap-2">
                <div className="flex items-center justify-center   transition-shadow">
                  <img
                    src='/images/1) - Juice MCB LOGO.png'
                    alt="Juice MCB"
                    className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-center   transition-shadow">
                  <img
                    src='/images/2) - emtel-blink-logo-500px.png'
                    alt="Emtel Blink"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-center   transition-shadow">
                  <img
                    src='/images/3) - Visa-Logo-2014.png'
                    alt="Visa"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-center   transition-shadow">
                  <img
                    src='/images/4) - Mastercard-logo.png'
                    alt="Mastercard"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>
                <div className="flex items-center justify-center   transition-shadow">
                  <img
                    src='/images/5) - maucas-logo-1024x263.png'
                    alt="Maucas"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center mb-3 sm:mb-4 md:mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{t.dubaiEventsTickets}</h2>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {t.dubaiDesc1}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {t.dubaiDesc2}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {t.dubaiDesc3}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              {t.dubaiDesc4}
            </p>
          </div>
        </div>

        {/* Footer-like Info */}
          <div className="w-full bg-white border-b border-gray-200 py-6 sm:py-8 md:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">

                {/* Left - Platinumlist Brand */}
                <div className="space-y-3 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="bg-black text-white p-2.5 rounded-lg">
                      <MessageCircle className="w-5 h-5" fill="white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black">Platinumlist</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Entertainment discovery and monetisation platform.
                  </p>
                </div>

                {/* Middle - Contact Question */}
                <div className="space-y-3 text-center">
                  <h3 className="text-base sm:text-lg font-bold text-black">Do you have any questions?</h3>
                  <p className="text-gray-600 text-sm">Please contact us</p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full transition-colors">
                      <FaWhatsapp className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Online</span>
                    </button>
                  </div>
                </div>

                {/* Right - We Accept */}
                <div className="space-y-3 text-center md:text-left">
                  <h3 className="text-base sm:text-lg font-bold text-black">We accept</h3>
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <img
                      src='/images/1) - Juice MCB LOGO.png'
                      alt="Juice MCB"
                      className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain"
                    />
                    <img
                      src='/images/2) - emtel-blink-logo-500px.png'
                      alt="Blink"
                      className="h-7 sm:h-8 w-auto object-contain"
                    />
                    <img
                      src='/images/3) - Visa-Logo-2014.png'
                      alt="Visa"
                      className="h-7 sm:h-8 w-auto object-contain"
                    />
                    <img
                      src='/images/4) - Mastercard-logo.png'
                      alt="Mastercard"
                      className="h-7 sm:h-8 w-auto object-contain"
                    />
                    <img
                      src='/images/5) - maucas-logo-1024x263.png'
                      alt="Maucas"
                      className="h-7 sm:h-8 w-auto object-contain"
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