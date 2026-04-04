'use client';

import { HeroCarousel } from '@/components/home';
import Footer from '@/components/home/Footer';
import Layout from '@/components/about/layout';
import { useCms } from '@/lib/useCms';
import { useLanguage } from '@/context/LanguageContext';

const SECTION_IDS = [
  'introduction', 'ticket-purchases', 'payment', 'refunds', 'event-changes',
  'conduct', 'accounts', 'intellectual-property', 'liability', 'privacy',
  'governing-law', 'contact', 'cookie-terms',
];

export default function TermsPage() {
  const { language } = useLanguage();
  const { get: getCms } = useCms('terms');
  const lang = language === 'fr' ? 'fr' : 'en';
  const l = lang === 'fr' ? 'Fr' : 'En';

  // Hero
  const heroCms = getCms('hero');
  const heroImage = heroCms.image || '/About%20Us.jpeg';
  const heroTitle = (heroCms.title as any)?.[lang] || '';
  const heroSubtitle = (heroCms.subtitle as any)?.[lang] || '';

  // Intro card
  const introCms = getCms('intro');
  const introTitle = (introCms.title as any)?.[lang] || '';
  const introDesc = (introCms.description as any)?.[lang] || '';

  // Footer note
  const footerCms = getCms('footer');
  const footerNote1 = (footerCms.extra as any)?.[`note1${l}`] || '';
  const footerNote2 = (footerCms.extra as any)?.[`note2${l}`] || '';

  // Build sections purely from DB
  const sections = SECTION_IDS.map((id, i) => {
    const extra = getCms(`section${i + 1}`).extra as Record<string, string> | undefined;
    return {
      id,
      title: extra?.[`title${l}`] || '',
      content: extra?.[`content${l}`] || '',
    };
  }).filter(s => s.title);

  return (
    <Layout>
      <HeroCarousel />

      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-[300px] mt-16 sm:mt-24 md:mt-28"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{heroTitle}</h1>
          <p className="text-lg text-gray-200 max-w-xl">{heroSubtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Intro card - full width */}
          <div className="bg-[#112b38] text-white rounded-2xl px-8 py-6 mb-10 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{introTitle}</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{introDesc}</p>
          </div>

          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* Left column — sticky Table of Contents */}
            <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-32 self-start">
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <h3 className="font-semibold text-[#112b38] text-lg mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-[#c89c6b] hover:text-[#112b38] transition-colors text-sm font-medium block leading-snug"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Right column — Terms content */}
            <div className="flex-1 min-w-0">
              <div className="space-y-10">
                {sections.map((s) => (
                  <div key={s.id} id={s.id} className="scroll-mt-32">
                    <h2 className="text-xl font-bold text-[#112b38] border-b-2 border-[#c89c6b] pb-2 mb-4">
                      {s.title}
                    </h2>
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {s.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom note */}
              <div className="mt-14 border-t border-gray-200 pt-8 text-center text-gray-500 text-xs">
                <p>{footerNote1}</p>
                <p className="mt-1">{footerNote2}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  );
}
