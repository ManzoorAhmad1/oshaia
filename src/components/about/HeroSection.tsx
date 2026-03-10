'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      className="relative bg-cover bg-center h-[350px] mt-16 sm:mt-24 md:mt-28"
      style={{ backgroundImage: 'url("/About%20Us.jpeg")' }}
    >
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t.aboutTitle}</h1>
        <p className="text-lg text-gray-200">
          {t.trustedPlatform}
        </p>
      </div>
    </section>
  );
}