'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function SponsorsCarousel() {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  const sponsors = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    src: `https://via.placeholder.com/120x120?text=Sponsor+${i + 1}`,
    alt: `Sponsor ${i + 1}`,
  }));

  return (
    <section className="bg-white py-16 border-t overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#c89c6b] mb-10">{t.ourSponsors}</h2>

        <div className="relative overflow-hidden">
          <div
            className="flex gap-10 items-center"
            style={{
              animation: isPaused ? 'none' : 'scrollSponsors 30s linear infinite',
              display: 'flex',
              width: 'max-content',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="flex-shrink-0">
                <img
                  src={sponsor.src}
                  alt={sponsor.alt}
                  className="h-20 w-20 object-cover rounded-full border-2 border-gray-200 grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {sponsors.map((sponsor) => (
              <div key={`duplicate-${sponsor.id}`} className="flex-shrink-0">
                <img
                  src={sponsor.src}
                  alt={sponsor.alt}
                  className="h-20 w-20 object-cover rounded-full border-2 border-gray-200 grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollSponsors {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}