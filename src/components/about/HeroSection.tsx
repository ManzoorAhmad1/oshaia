'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section
      className="relative bg-cover bg-center h-[350px] mt-60 sm:mt-48 md:mt-40 lg:mt-44 xl:mt-28"
      style={{ backgroundImage: 'url("/About%20Us.jpeg")' }}
    >
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 px-4">{t.aboutTitle}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 px-4">
          {t.trustedPlatform}
        </p>
      </div>
    </section>
  );
}