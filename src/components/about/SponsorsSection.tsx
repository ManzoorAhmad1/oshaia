'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';

export default function SponsorsSection() {
  const sponsors = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    src: `https://via.placeholder.com/140x70?text=Sponsor+${i + 1}`,
    alt: `Sponsor ${i + 1}`,
  }));

  return (
    <section className="bg-white py-16 border-t">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#c89c6b] mb-10">Our Sponsors</h2>
        <div className="px-4">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={5}
            autoplay={{ delay: 2000 }}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="sponsors-swiper"
          >
            {sponsors.map((sponsor) => (
              <SwiperSlide key={sponsor.id}>
                <div className="flex justify-center items-center h-full">
                  <img
                    src={sponsor.src}
                    alt={sponsor.alt}
                    className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}