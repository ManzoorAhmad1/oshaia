'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HelpCenterHero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-cover bg-center h-[350px]" style={{backgroundImage: 'url(/uploads/defaults/help-banner.jpg)'}}>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{t.helpTitle}</h1>
        <p className="text-lg text-gray-200">
          {t.getInstantAnswers}
        </p>
      </div>
    </section>
  );
}