'use client';

import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsHeadset,
} from 'react-icons/bs';
import { useLanguage } from '@/context/LanguageContext';
import { useCms } from '@/lib/useCms';

export default function ServicesSection() {
  const { language } = useLanguage();
  const { get: getCms, text: cmsText } = useCms('about');
  const extra = getCms('services').extra as Record<string, string> | undefined;
  const lang = language === 'fr' ? 'fr' : 'en';
  const ls = language === 'fr' ? 'Fr' : 'En';

  const sectionTitle = cmsText('services', 'title', lang as 'en' | 'fr');

  const services = [
    {
      icon: <BsShieldCheck className="text-[#c89c6b] text-4xl mb-3" />,
      title: extra?.[`card1title${ls}`] || '',
      description: extra?.[`card1desc${ls}`] || '',
    },
    {
      icon: <BsLightningCharge className="text-[#c89c6b] text-4xl mb-3" />,
      title: extra?.[`card2title${ls}`] || '',
      description: extra?.[`card2desc${ls}`] || '',
    },
    {
      icon: <BsHeadset className="text-[#c89c6b] text-4xl mb-3" />,
      title: extra?.[`card3title${ls}`] || '',
      description: extra?.[`card3desc${ls}`] || '',
    },
  ].filter(s => s.title);

  return (
    <section className="bg-white  mt-6 sm:mt-8 md:mt-10 py-10 mb-6 sm:mb-8 md:mb-10">
      <div className="w-full sm:w-[85%] mx-auto px-4 sm:px-0 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#c89c6b] mb-6">{sectionTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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