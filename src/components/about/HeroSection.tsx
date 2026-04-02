'use client';

import { useLanguage } from '@/context/LanguageContext';
import { useCms } from '@/lib/useCms';

export default function HeroSection() {
  const { t, language } = useLanguage();
  const { get: getCms, text: cmsText } = useCms('about');

  const heroImage = getCms('hero').image || '/About%20Us.jpeg';
  const heroTitle = cmsText('hero', 'title', language as 'en' | 'fr') || t.aboutTitle;
  const heroSubtitle = cmsText('hero', 'subtitle', language as 'en' | 'fr') || t.trustedPlatform;

  return (
    <section
      className="relative bg-cover bg-center h-[350px] mt-60 sm:mt-48 md:mt-40 lg:mt-44 xl:mt-28"
      style={{ backgroundImage: `url("${heroImage}")` }}
    >
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 px-4">{heroTitle}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 px-4">
          {heroSubtitle}
        </p>
      </div>
    </section>
  );
}