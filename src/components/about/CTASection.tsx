'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CTASection() {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[#112b38] text-white text-center mt-6 sm:mt-8 md:mt-10 pb-6 sm:pb-8 md:pb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 pt-8">
        {t.joinThousands}
      </h2>
      <p className="text-gray-100 mb-6">
        {t.experienceEasiest}
      </p>
      <Link
        href="/event"
        className="inline-block bg-white text-[#c89c6b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        {t.browseEvents}
      </Link>
    </section>
  );
}