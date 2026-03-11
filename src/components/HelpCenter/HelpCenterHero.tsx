'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HelpCenterHero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-cover bg-center h-[350px] mt-60 sm:mt-48 md:mt-40 lg:mt-44 xl:mt-28" style={{ backgroundImage: 'url("/Help Center.jpeg")' }}
    >
      <div className="absolute inset-0 bg-[#112b38] bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 px-4">{t.helpTitle}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 px-4">
          {t.getInstantAnswers}
        </p>
      </div>
    </section>
  );
}