import Link from 'next/link';

export default function ContactCTA() {
  return (
    <section className="bg-[#c89c6b] text-white py-12 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-3">
        Still Need Help?
      </h2>
      <p className="text-gray-100 mb-6">
        Our support team is ready to assist you with any issue.
      </p>
      <Link
        href="/contact"
        className="inline-block bg-white text-[#c89c6b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Contact Support
      </Link>
    </section>
  );
}