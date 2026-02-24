'use client';

import React from 'react';
import { CreditCard, Apple, MessageCircle, Shield, Zap, Ticket, Clock, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FaWhatsapp } from 'react-icons/fa';

const Platinumlist = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full sm:w-[85%] mx-auto py-6 sm:py-8 md:py-10 px-0 mt-6 sm:mt-8 md:mt-10">

      <div className="w-full mx-auto">
        <div>
          {/* Why buy with Platinumlist */}
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-900'>
            {t.whyBuyWithUs}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8 md:mb-10">
            {[
              {
                icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
                title: t.secureCheckout,
                desc: t.fastSecuredPayment,
                color: "text-blue-600"
              },
              {
                icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
                title: t.instantConfirmation,
                desc: t.refundGuarantee,
                color: "text-green-600"
              },
              {
                icon: <Ticket className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
                title: t.officialTicketSeller,
                desc: t.usedByPeople,
                color: "text-gray-800"
              },
              {
                icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />,
                title: t.customerService247,
                desc: t.reliableAfterSales,
                color: "text-gray-800"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-start"
              >
                <div className={`mb-3 sm:mb-4 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
          {/* Payment Methods */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col items-start">
              <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">{t.youChooseHowToPay}</div>
              <img
                src='/Red Simple Typographic 2026 Christmas Supplies Logo.png'
                alt="Payment Methods"
                className="h-8 sm:h-10 md:h-12 w-auto object-contain"
              />
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
          <div className="w-full bg-white border-gray-200 py-6 sm:py-8 md:py-10">
            <div className="w-full mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">

                {/* Left - Platinumlist Brand */}
                <div className="space-y-3 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="bg-[#112b38] text-white p-2.5 rounded-lg">
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
                  <div className="flex justify-center md:justify-start">
                    <img
                      src='/Red Simple Typographic 2026 Christmas Supplies Logo.png'
                      alt="Payment Methods"
                      className="h-8 sm:h-10 md:h-12 w-auto object-contain"
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