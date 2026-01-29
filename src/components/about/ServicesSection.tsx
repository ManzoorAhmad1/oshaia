import { BiCalendarEvent } from "react-icons/bi";
import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsHeadset,
} from 'react-icons/bs';
export default function ServicesSection() {
  const services = [
    {
      icon: <BsShieldCheck className="text-[#c89c6b] text-4xl mb-3" />,
      title: 'Online Ticketing',
      description: 'Book your tickets for concerts, sports, and festivals instantly through our secure platform.',
    },
    {
      icon: <BsLightningCharge className="text-[#c89c6b] text-4xl mb-3" />,
      title: 'Event Management',
      description: 'Event organizers can easily manage schedules, ticket categories, and customer data.',
    },
    {
      icon: <BsHeadset className="text-[#c89c6b] text-4xl mb-3" />,
      title: 'Sponsor & Partner Access',
      description: 'We connect sponsors with events that match their audience and brand goals.',
    },
  ];

  return (
    <section className="bg-white py-16 border-t">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-[#c89c6b] mb-10">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#f8f8f8] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-center justify-center flex-col"
            >
              {service.icon}
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}