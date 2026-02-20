'use client';

import { BiCalendarEvent } from "react-icons/bi";
import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsHeadset,
} from 'react-icons/bs';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesSection() {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: <BsShieldCheck className="text-[#c89c6b] text-4xl mb-3" />,
      title: t.onlineTicketing,
      description: t.onlineTicketingDesc,
    },
    {
      icon: <BsLightningCharge className="text-[#c89c6b] text-4xl mb-3" />,
      title: t.eventManagement,
      description: t.eventManagementDesc,
    },
    {
      icon: <BsHeadset className="text-[#c89c6b] text-4xl mb-3" />,
      title: t.sponsorPartnerAccess,
      description: t.sponsorPartnerAccessDesc,
    },
  ];

  return (
    <section className="bg-white  mt-6 sm:mt-8 md:mt-10 py-10 mb-6 sm:mb-8 md:mb-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#c89c6b] mb-6">{t.whatWeOffer}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#f8f8f8] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-center justify-center flex-col"
            >
              {service.icon}
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}