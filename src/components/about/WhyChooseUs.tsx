'use client';

import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsHeadset,
} from 'react-icons/bs';
import { useLanguage } from '@/context/LanguageContext';
import { useCms } from '@/lib/useCms';

export default function WhyChooseUs() {
  const { language } = useLanguage();
  const { get: getCms, text: cmsText } = useCms('about');
  const extra = getCms('whyChooseUs').extra as Record<string, string> | undefined;
  const lang = language === 'fr' ? 'fr' : 'en';
  const ls = language === 'fr' ? 'Fr' : 'En';

  const sectionTitle = cmsText('whyChooseUs', 'title', lang as 'en' | 'fr');

  const reasons = [
    {
      icon: <BsShieldCheck className="text-4xl text-[#c89c6b] mb-3" />,
      title: extra?.[`card1title${ls}`] || '',
      description: extra?.[`card1desc${ls}`] || '',
    },
    {
      icon: <BsLightningCharge className="text-4xl text-[#c89c6b] mb-3" />,
      title: extra?.[`card2title${ls}`] || '',
      description: extra?.[`card2desc${ls}`] || '',
    },
    {
      icon: <BsHeadset className="text-4xl text-[#c89c6b] mb-3" />,
      title: extra?.[`card3title${ls}`] || '',
      description: extra?.[`card3desc${ls}`] || '',
    },
  ].filter(r => r.title);

  return (
    <section className="w-full sm:w-[85%] mx-auto px-4 sm:px-0 mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#c89c6b] mb-6">{sectionTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
        {reasons.map((reason, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border shadow-sm flex items-center justify-center flex-col">
            {reason.icon}
            <h4 className="font-semibold mb-1">{reason.title}</h4>
            <p className="text-sm text-gray-600">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}