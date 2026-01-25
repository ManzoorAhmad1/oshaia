import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#E85C0D] mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We are a dynamic event ticketing platform built to make your event experience seamless — from browsing to booking.
            Our mission is to connect event organizers and attendees through an intuitive and secure digital environment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Whether you're looking to host concerts, festivals, conferences, or community gatherings,
            we provide the tools to manage ticket sales, seat selections, and promotions efficiently.
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