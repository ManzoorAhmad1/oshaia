'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useCms } from '@/lib/useCms';

const Platinumlist = () => {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { get: getCms } = useCms('home');
  const cms = getCms('platinumlist');
  const extra = cms.extra as Record<string, string> | undefined;

  const whyBuyTitle = language === 'fr' ? (cms.title?.fr || t.whyBuyWithUs) : (cms.title?.en || t.whyBuyWithUs);
  const seoTitle = language === 'fr' ? (cms.subtitle?.fr || t.dubaiEventsTickets) : (cms.subtitle?.en || t.dubaiEventsTickets);
  const paymentImage = cms.image || '/Red Simple Typographic 2026 Christmas Supplies Logo.png';

  const desc = (n: 1 | 2 | 3 | 4): string => {
    const key = `desc${n}${language}` as string;
    const fallback = t[`dubaiDesc${n}` as keyof typeof t] as string;
    return extra?.[key] || fallback || '';
  };

  return (
    <section className="w-full sm:w-[85%] mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-0 mt-6 sm:mt-8 md:mt-10">

      <div className="w-full mx-auto">
        <div className="md:w-3/4">
          {/* Why buy with Platinumlist */}
          <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-900'>
            {whyBuyTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 md:gap-2 mb-6 sm:mb-8 md:mb-10">
            {[
              { icon: '/icons/why-buy/secure-checkout.svg', title: t.secureCheckout, desc: t.fastSecuredPayment, alt: 'Secure Checkout' },
              { icon: '/icons/why-buy/instant-confirmation.svg', title: t.instantConfirmation, desc: t.refundGuarantee, alt: 'Instant Confirmation' },
              { icon: '/icons/why-buy/official-ticket-seller.svg', title: t.officialTicketSeller, desc: t.usedByPeople, alt: 'Official Ticket Seller' },
              { icon: '/icons/why-buy/customer-service.svg', title: t.customerService247, desc: t.reliableAfterSales, alt: '24/7 Customer Service' },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-start"
              >
                <div className="mb-3 sm:mb-4">
                  <img src={feature.icon} alt={feature.alt} className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2 text-gray-900 whitespace-nowrap">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-500 whitespace-nowrap">
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
                  src={paymentImage}
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
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{seoTitle}</h2>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="text-sm  text-gray-700 leading-relaxed">
              {desc(1)}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {desc(2)}
            </p>
            <p className="text-sm  text-gray-700 leading-relaxed">
              {desc(3)}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {desc(4)}
            </p>
          </div>
        </div>

        {/* Footer-like Info */}
        <div className="w-full bg-white py-3.5 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">

              {/* Left - Brand Section */}
              <div className="md:col-span-4 flex items-center justify-center md:justify-start h-10">
                <img
                  src='Main Oshaia.com.png'
                  alt="Platinumlist Logo"
                  className="w-auto h-auto object-contain"
                />
              </div>

              {/* Divider 1 */}
              <div className="hidden md:block md:col-span-1">
                <div className="h-10 w-px bg-gray-300 mx-auto"></div>
              </div>

              {/* Middle - Contact Section */}
              <div className="md:col-span-3 flex flex-col items-center space-y-1.5">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 text-center">
                  {t.doYouHaveQuestion}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm hover:text-[#c89c6b] cursor-pointer" onClick={() => router.push('help')}>
                  {t.pleaseContactUs}
                </p>
              </div>

              {/* Divider 2 */}
              <div className="hidden md:block md:col-span-1">
                <div className="h-10 w-px bg-gray-300 mx-auto"></div>
              </div>

              {/* Right - WhatsApp Chat Online */}
              <div className="md:col-span-3 flex items-center justify-center gap-2.5">
                {/* Green WhatsApp circle */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#25D366] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 sm:w-7 sm:h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.444.658 4.733 1.806 6.7L2 30l7.494-1.778A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 01-5.897-1.61l-.423-.252-4.452 1.056 1.09-4.33-.276-.444A11.56 11.56 0 014.4 16C4.4 9.593 9.593 4.4 16 4.4S27.6 9.593 27.6 16 22.407 27.6 16 27.6zm6.34-8.64c-.347-.174-2.055-1.014-2.374-1.13-.319-.116-.551-.174-.784.174-.232.347-.9 1.13-1.103 1.362-.203.232-.406.26-.753.087-.347-.174-1.465-.54-2.79-1.72-1.031-.92-1.727-2.055-1.93-2.402-.203-.347-.022-.535.152-.708.156-.155.347-.406.52-.609.174-.203.232-.347.347-.58.116-.232.058-.435-.029-.609-.087-.174-.784-1.89-1.074-2.588-.283-.68-.57-.587-.784-.598l-.668-.012c-.232 0-.609.087-.928.435-.319.347-1.218 1.19-1.218 2.9s1.247 3.365 1.42 3.597c.174.232 2.453 3.747 5.944 5.254.831.359 1.48.573 1.985.733.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.345-1.652.29-.812.29-1.508.203-1.652-.087-.145-.319-.232-.667-.406z" />
                  </svg>
                </div>
                {/* Chat online pill */}
                <a
                  href={`https://wa.me/${extra?.whatsappNumber || '2300000000'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-900 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 group"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-gray-900 group-hover:fill-white transition-colors flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                  <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-white transition-colors whitespace-nowrap">
                    {t.chatOnline}
                  </span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Platinumlist;