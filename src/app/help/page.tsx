import HelpCenterHero from '@/components/HelpCenter/HelpCenterHero';
import HelpChatBot from '@/components/HelpCenter/HelpChatBot';
import ContactCTA from '@/components/HelpCenter/ContactCTA';
import Layout from '@/components/about/layout';
import Footer from '@/components/HelpCenter/Footer';

export default function HelpPage() {
  return (
    <Layout>
      <HelpCenterHero />
      <HelpChatBot />
      <ContactCTA />
      <Footer />
    </Layout>
  );
}