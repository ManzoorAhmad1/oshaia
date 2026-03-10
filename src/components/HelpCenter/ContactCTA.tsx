'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactCTA() {
  const { t } = useLanguage();
  
  return (
    <section className="bg-[#112b38] text-white mt-6 sm:mt-8 md:mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left column — Still Need Help */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {t.stillNeedHelp}
          </h2>
          <p className="text-gray-300 mb-6">
            {t.supportTeamReady}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#c89c6b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {t.contactSupport}
          </Link>
        </div>

        {/* Right column — Terms & Conditions */}
        <div className="border border-white/20 rounded-2xl p-8 bg-white/5 text-center md:text-left">
          <h3 className="text-xl font-bold mb-3 text-[#c89c6b]">Legal</h3>
          <p className="text-gray-300 text-sm mb-5 leading-relaxed">
            Please review our terms and cookie policy before using the Oshaia platform and purchasing event tickets.
          </p>
          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 text-sm">
            <Link
              href="/terms"
              className="inline-block bg-[#c89c6b] text-[#112b38] font-semibold px-5 py-2 rounded-lg hover:bg-[#b8895a] transition"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/terms#cookie-terms"
              className="inline-block border border-white/30 text-gray-200 font-semibold px-5 py-2 rounded-lg hover:border-[#c89c6b] hover:text-[#c89c6b] transition"
            >
              Cookie Terms
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}