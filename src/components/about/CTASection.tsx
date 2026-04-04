'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCms } from '@/lib/useCms';

export default function CTASection() {
  const { language } = useLanguage();
  const { text: cmsText, get: getCms } = useCms('about');
  const lang = language === 'fr' ? 'fr' : 'en';

  const title = cmsText('cta', 'title', lang as 'en' | 'fr');
  const desc = cmsText('cta', 'description', lang as 'en' | 'fr');
  const btnText = cmsText('cta', 'buttonText', lang as 'en' | 'fr');
  const btnLink = getCms('cta').buttonLink || '/event';
  
  return (
    <section className="bg-[#112b38] text-white text-center mt-6 sm:mt-8 md:mt-10 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-0">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 pt-6 md:pt-8">
        {title}
      </h2>
      <p className="text-gray-100 mb-6">
        {desc}
      </p>
      <Link
        href={btnLink}
        className="inline-block bg-white text-[#c89c6b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        {btnText}
      </Link>
    </section>
  );
}