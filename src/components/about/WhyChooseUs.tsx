import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsHeadset,
} from 'react-icons/bs';
export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <BsShieldCheck className="text-4xl text-[#E85C0D] mb-3" />,
      title: 'Secure Payment',
      description: 'All transactions are encrypted for your safety and peace of mind.',
    },
    {
      icon: <BsLightningCharge className="text-4xl text-[#E85C0D] mb-3" />,
      title: 'Fast & Easy',
      description: 'Book tickets in just a few clicks with our user-friendly interface.',
    },
    {
      icon: <BsHeadset className="text-4xl text-[#E85C0D] mb-3" />,
      title: 'Customer Support',
      description: 'We\'re here to help — from booking issues to event inquiries.',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-[#E85C0D] mb-10">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {reasons.map((reason, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border shadow-sm">
            {reason.icon}
            <h4 className="font-semibold mb-1">{reason.title}</h4>
            <p className="text-sm text-gray-600">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}