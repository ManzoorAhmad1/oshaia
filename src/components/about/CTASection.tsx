import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-[#c89c6b] text-white py-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Join Thousands of Event-Goers Today
      </h2>
      <p className="text-gray-100 mb-6">
        Experience the easiest way to discover and attend your favorite events.
      </p>
      <Link
        href="/events"
        className="inline-block bg-white text-[#c89c6b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Browse Events
      </Link>
    </section>
  );
}