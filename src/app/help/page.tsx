import HelpCenterHero from '@/components/HelpCenter/HelpCenterHero';
import HelpChatBot from '@/components/HelpCenter/HelpChatBot';
import ContactCTA from '@/components/HelpCenter/ContactCTA';
import Layout from '@/components/about/layout';
import Footer from '@/components/home/Footer'
import { HeroCarousel } from '@/components/home';

export default function HelpPage() {
  return (
    <Layout>
      <HeroCarousel/>
      <HelpCenterHero />
      <HelpChatBot />
      <ContactCTA />
      <Footer />
    </Layout>
  );
}