'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();
  
  return (
    <section className="max-w-6xl mx-auto px-6 mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#c89c6b] mb-4">{t.whoWeAre}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t.whoWeAreDesc1}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t.whoWeAreDesc2}
          </p>
        </div>
        <div>
          <Image
            src="/uploads/defaults/about-photo.jpg"
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