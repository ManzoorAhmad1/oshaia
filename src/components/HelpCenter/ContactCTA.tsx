'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCms } from '@/lib/useCms';

export default function ContactCTA() {
  const { language } = useLanguage();
  const { text: cmsText, get: getCms } = useCms('help');
  const lang = language === 'fr' ? 'fr' : 'en';

  const title = cmsText('contact', 'title', lang as 'en' | 'fr');
  const desc = cmsText('contact', 'description', lang as 'en' | 'fr');
  const btnText = cmsText('contact', 'buttonText', lang as 'en' | 'fr');
  const btnLink = getCms('contact').buttonLink || '/contact';
  const extra = getCms('contact').extra as Record<string, string> | undefined;
  const ls = language === 'fr' ? 'Fr' : 'En';

  const legalTitle = extra?.[`legalTitle${ls}`] || '';
  const legalDesc = extra?.[`legalDesc${ls}`] || '';
  const termsLabel = extra?.[`termsLabel${ls}`] || '';
  const termsLink = extra?.termsLink || '/terms';
  const cookieLabel = extra?.[`cookieLabel${ls}`] || '';
  const cookieLink = extra?.cookieLink || '/terms#cookie-terms';
  
  return (
    <section className="bg-[#112b38] text-white mt-6 sm:mt-8 md:mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left column — Still Need Help */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {title}
          </h2>
          <p className="text-gray-300 mb-6">
            {desc}
          </p>
          <Link
            href={btnLink}
            className="inline-block bg-white text-[#c89c6b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {btnText}
          </Link>
        </div>

        {/* Right column — Terms & Conditions */}
        <div className="border border-white/20 rounded-2xl p-8 bg-white/5 text-center md:text-left">
          <h3 className="text-xl font-bold mb-3 text-[#c89c6b]">{legalTitle}</h3>
          <p className="text-gray-300 text-sm mb-5 leading-relaxed">
            {legalDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 text-sm">
            <Link
              href={termsLink}
              className="inline-block bg-[#c89c6b] text-[#112b38] font-semibold px-5 py-2 rounded-lg hover:bg-[#b8895a] transition"
            >
              {termsLabel}
            </Link>
            <Link
              href={cookieLink}
              className="inline-block border border-white/30 text-gray-200 font-semibold px-5 py-2 rounded-lg hover:border-[#c89c6b] hover:text-[#c89c6b] transition"
            >
              {cookieLabel}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}