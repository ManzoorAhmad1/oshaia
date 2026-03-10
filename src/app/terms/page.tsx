'use client';

import { HeroCarousel } from '@/components/home';
import Footer from '@/components/home/Footer';
import Layout from '@/components/about/layout';

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `Welcome to Oshaia. These Terms and Conditions govern your use of the Oshaia platform and the purchase of event tickets through our website and related services. By accessing or using our platform, you agree to be bound by these Terms and Conditions in their entirety. If you do not agree with any part of these terms, please refrain from using our services.

Oshaia is operated by Aventure Agency LTD. These terms apply to all users including registered members, guests, and ticket purchasers. We reserve the right to update or modify these terms at any time without prior notice, and your continued use of our platform constitutes acceptance of those changes.`,
  },
  {
    id: 'ticket-purchases',
    title: '2. Ticket Purchases',
    content: `All ticket purchases made through Oshaia are subject to availability. When you place an order, you are making an offer to purchase tickets at the listed price. Your order is confirmed only upon receipt of our confirmation email and successful payment processing.

Tickets are issued electronically and may be presented at the event venue via mobile device or printed copy. You are responsible for ensuring the validity and safekeeping of your tickets. Oshaia is not liable for lost, stolen, or damaged tickets once delivered electronically.

Each ticket is valid for one (1) admission only. Duplicate or reproduced tickets will be deemed invalid and denied entry. Tickets may not be resold for profit beyond face value unless expressly permitted by local law.`,
  },
  {
    id: 'payment',
    title: '3. Payment & Pricing',
    content: `All prices displayed on the Oshaia platform are in the currency specified at checkout. Ticket prices are set by the event organiser and may include applicable taxes, service fees, and booking charges, which will be clearly outlined before final purchase confirmation.

Oshaia accepts the following payment methods: Visa, Mastercard, American Express, and Apple Pay. All transactions are processed through our secure, encrypted payment gateway. Card details are never stored on our servers.

In the event of a pricing error, Oshaia reserves the right to cancel orders and issue a full refund. We will notify affected customers as soon as possible.`,
  },
  {
    id: 'refunds',
    title: '4. Refund & Cancellation Policy',
    content: `All ticket sales are generally final. Refunds are only available under the following circumstances:

• The event is officially cancelled by the organiser and not rescheduled.
• The event is postponed and you are unable to attend on the new date.
• A duplicate charge has occurred due to a technical error.

To request a refund, you must contact our support team within 14 days of the event cancellation or postponement announcement. Refunds will be processed to the original payment method within 7–14 business days, depending on your bank or card issuer.

Service fees and booking charges are non-refundable unless the event is fully cancelled and not rescheduled.`,
  },
  {
    id: 'event-changes',
    title: '5. Event Changes & Cancellations',
    content: `Events are subject to change or cancellation by the event organiser. Oshaia will make every reasonable effort to notify ticket holders of significant changes, including date, time, venue, or line-up alterations, via the email address provided at the time of purchase.

Oshaia is not responsible for decisions made by event organisers, including changes to performer line-ups, event schedules, or venue logistics. Minor changes to the event programme do not automatically entitle ticket holders to a refund.

In the event of cancellation, Oshaia will process refunds in accordance with our Refund & Cancellation Policy above.`,
  },
  {
    id: 'conduct',
    title: '6. Attendee Conduct & Prohibited Activities',
    content: `By purchasing tickets through Oshaia, you agree to comply with the terms of entry and codes of conduct set by the event organiser and venue. Failure to do so may result in removal from the event without a refund.

The following activities are strictly prohibited:

• Reselling or transferring tickets without authorisation.
• Using bots, automated scripts, or other technology to purchase tickets.
• Providing false or fraudulent information during the purchase process.
• Entering the event with counterfeit or invalid tickets.
• Any conduct that is abusive, threatening, or disruptive to other attendees or staff.

Oshaia reserves the right to cancel tickets and ban users who violate these terms.`,
  },
  {
    id: 'accounts',
    title: '7. User Accounts & Security',
    content: `To purchase tickets, you may be required to create an Oshaia account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.

You must provide accurate and complete information when registering. Oshaia reserves the right to suspend or terminate accounts that contain false information, are engaged in fraudulent activities, or violate these Terms and Conditions.

If you believe your account has been compromised, please contact our support team immediately. Oshaia will not be held liable for any loss or damage arising from your failure to protect your account credentials.`,
  },
  {
    id: 'intellectual-property',
    title: '8. Intellectual Property',
    content: `All content on the Oshaia platform, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of Aventure Agency LTD or its content licensors and is protected by applicable intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any content from the Oshaia platform without our express prior written consent.`,
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: `To the fullest extent permitted by applicable law, Oshaia and Aventure Agency LTD shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, resulting from:

• Your use or inability to use the platform.
• Any unauthorised access to or use of our servers or personal information.
• Any interruption or cessation of transmission to or from our platform.
• Any bugs, viruses, or other harmful code transmitted through the platform.
• Any event cancellation, postponement, or change beyond our reasonable control.

Our total liability to you for any claim arising under these terms shall not exceed the total amount paid by you for the relevant ticket(s).`,
  },
  {
    id: 'privacy',
    title: '10. Privacy & Data Protection',
    content: `Your privacy is important to us. By using the Oshaia platform and purchasing tickets, you consent to the collection, processing, and use of your personal data in accordance with our Privacy Policy.

We collect personal information such as your name, email address, phone number, and payment details solely for the purpose of processing your ticket purchase and providing customer support. We do not sell your personal data to third parties.

We may send you transactional emails related to your purchase, and with your explicit consent, promotional communications about upcoming events and offers. You may unsubscribe from marketing emails at any time.`,
  },
  {
    id: 'governing-law',
    title: '11. Governing Law',
    content: `These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Aventure Agency LTD is registered, without regard to its conflict of law provisions.

Any disputes arising out of or in connection with these terms shall first be subject to good-faith negotiation between the parties. If no resolution is reached, disputes shall be submitted to the exclusive jurisdiction of the competent courts in the applicable jurisdiction.`,
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    content: `If you have any questions, concerns, or complaints regarding these Terms and Conditions or your ticket purchase, please contact our support team:

• Email: needhelp@oshaia.com
• Phone: (022) 666 888 0000
• Address: Maxuel Street, Frankfurt 2589, Germany
• Website: www.oshaia.com

Our customer support team is available to assist you Monday to Friday, 9:00 AM – 6:00 PM (CET).

Last updated: March 2026`,
  },
  {
    id: 'cookie-terms',
    title: '13. Cookie Policy',
    content: `Oshaia uses cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small data files stored on your device that help us recognise you, remember your preferences, and improve the functionality of our website.

Types of cookies we use:

• Essential Cookies: Required for the platform to function properly, including session management and secure checkout. These cannot be disabled.
• Analytical Cookies: Help us understand how visitors interact with the platform so we can improve the user experience (e.g., Google Analytics).
• Functional Cookies: Allow us to remember your preferences such as language settings and login details.
• Marketing Cookies: Used to deliver personalised advertisements and track the effectiveness of our marketing campaigns.

You may manage your cookie preferences through your browser settings at any time. Please note that disabling certain cookies may affect the functionality of the platform.

By continuing to use Oshaia, you consent to our use of cookies as described in this policy.

Last updated: March 2026`,
  },
];

export default function TermsPage() {
  return (
    <Layout>
      <HeroCarousel />

      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-[300px] mt-16 sm:mt-24 md:mt-28"
        style={{ backgroundImage: 'url("/About%20Us.jpeg")' }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms &amp; Conditions</h1>
          <p className="text-lg text-gray-200 max-w-xl">
            Please read these terms carefully before purchasing tickets on Oshaia.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Intro card - full width */}
          <div className="bg-[#112b38] text-white rounded-2xl px-8 py-6 mb-10 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Oshaia – Event Ticket Purchases</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              These terms and conditions govern all ticket purchases made through the Oshaia platform operated by Aventure Agency LTD. By completing a purchase, you agree to abide by these terms in full.
            </p>
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
                <p>© 2026 Oshaia.com, Aventure Agency LTD. All rights reserved.</p>
                <p className="mt-1">These terms were last updated in March 2026 and supersede all previous versions.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </Layout>
  );
}
