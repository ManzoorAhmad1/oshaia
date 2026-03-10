'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

const Platinumlist = () => {
  const { t } = useLanguage();
  const router = useRouter()
  return (
    <section className="w-full sm:w-[85%] mx-auto py-6 sm:py-8 md:py-10 px-0 mt-6 sm:mt-8 md:mt-10">

      <div className="w-full mx-auto">
        <div className="md:w-1/2">
          {/* Why buy with Platinumlist */}
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-900'>
            {t.whyBuyWithUs}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-6 mb-6 sm:mb-8 md:mb-10">
            {[
              {
                icon: "https://cdn.platinumlist.net/dist/v876/img/why-buy-with-us/secure-checkout.svg",
                title: t.secureCheckout,
                desc: t.fastSecuredPayment,
                alt: "Secure Checkout"
              },
              {
                icon: "https://cdn.platinumlist.net/dist/v876/img/why-buy-with-us/instant-confirmation.svg",
                title: t.instantConfirmation,
                desc: t.refundGuarantee,
                alt: "Instant confirmation"
              },
              {
                icon: "https://cdn.platinumlist.net/dist/v876/img/why-buy-with-us/official-ticket-seller.svg",
                title: t.officialTicketSeller,
                desc: t.usedByPeople,
                alt: "Official Ticket Seller"
              },
              {
                icon: "https://cdn.platinumlist.net/dist/v876/img/why-buy-with-us/customer-service.svg",
                title: t.customerService247,
                desc: t.reliableAfterSales,
                alt: "24/7 Customer Service"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-start"
              >
                <div className="mb-3 sm:mb-4">
                  <img
                    src={feature.icon}
                    alt={feature.alt}
                    className="w-8 h-8 "
                  />
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
              <div className="flex justify-center">
                <img
                  src='/Red Simple Typographic 2026 Christmas Supplies Logo.png'
                  alt="Payment Methods"
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                />
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
        <div className="w-full bg-white border-t border-gray-200 py-8 sm:py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">

              {/* Left - Brand Section */}
              <div className="md:col-span-5 flex flex-col items-center md:items-start space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src='Main Oshaia.com.png'
                      alt="Platinumlist Logo"
                      className="h-12 w-auto md:h-14 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    Platinumlist
                  </h2>
                </div>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md text-center md:text-left">
                  Entertainment discovery and monetisation platform.
                </p>
              </div>

              {/* Divider - Hidden on mobile */}
              <div className="hidden md:block md:col-span-1">
                <div className="h-12 w-px bg-gray-300 mx-auto"></div>
              </div>

              {/* Middle - Contact Section */}
              <div className="md:col-span-3 flex flex-col items-center space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  Do you have any questions?
                </h3>
                <p className="text-gray-600 text-sm md:text-base hover:text-[#c89c6b] cursor-pointer" onClick={() => router.push('help')}>
                  Please contact us
                </p>
              </div>

              {/* Divider - Hidden on mobile */}
              <div className="hidden md:block md:col-span-1">
                <div className="h-12 w-px bg-gray-300 mx-auto"></div>
              </div>

              {/* Right - Original Size WhatsApp Image */}
              <div className="md:col-span-2 flex justify-center md:justify-start">
                <img
                  src='/whatsapp12.png'
                  alt="WhatsApp"
                  className="w-auto h-auto max-w-full object-contain cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platinumlist;