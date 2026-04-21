'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useCms } from '@/lib/useCms';

export default function AboutSection() {
  const { language } = useLanguage();
  const { get: getCms, text: cmsText } = useCms('about');
  const cms = getCms('whoWeAre');
  const extra = cms.extra as Record<string, string> | undefined;
  const lang = language === 'fr' ? 'fr' : 'en';
  const langSuffix = language === 'fr' ? 'Fr' : 'En';

  const sectionImage = cms.image || '/about us small square.jpeg';
  const title = cmsText('whoWeAre', 'title', lang as 'en' | 'fr');
  const desc1 = cmsText('whoWeAre', 'description', lang as 'en' | 'fr');
  const desc2 = extra?.[`desc2${langSuffix}`] || '';

  return (
    <section className="w-full sm:w-[85%] mx-auto px-4 sm:px-0 mt-12 mb-6 sm:mb-8 md:mb-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#c89c6b] mb-4">{title}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {desc1}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {desc2}
          </p>
        </div>
        <div>
          <Image
            src={sectionImage}
            alt="About"
            width={600}
            height={300}
            className="rounded-2xl shadow-lg w-full object-cover h-[300px]"
          />
        </div>
      </div>
    </section>
  );
}