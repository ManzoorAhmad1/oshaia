'use client';

import { 
  BsShieldCheck, 
  BsLightningCharge, 
  BsHeadset,
} from 'react-icons/bs';
import { useLanguage } from '@/context/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();
  
  const reasons = [
    {
      icon: <BsShieldCheck className="text-4xl text-[#c89c6b] mb-3" />,
      title: t.securePayment,
      description: t.securePaymentDesc,
    },
    {
      icon: <BsLightningCharge className="text-4xl text-[#c89c6b] mb-3" />,
      title: t.fastEasy,
      description: t.fastEasyDesc,
    },
    {
      icon: <BsHeadset className="text-4xl text-[#c89c6b] mb-3" />,
      title: t.customerSupportTitle,
      description: t.customerSupportDesc,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10">
      <h2 className="text-3xl font-bold text-center text-[#c89c6b] mb-6">{t.whyChooseUs}</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {reasons.map((reason, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border shadow-sm flex items-center justify-center flex-col">
            {reason.icon}
            <h4 className="font-semibold mb-1">{reason.title}</h4>
            <p className="text-sm text-gray-600">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}