
import SponsorsSection from '@/components/about/SponsorsSection';
import CTASection from '@/components/about/CTASection';
import HeroSection from '@/components/about/HeroSection';
import AboutSection from '@/components/about/AboutSection';
import ServicesSection from '@/components/about/ServicesSection';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import Layout from '@/components/about/layout';

export default function AboutPage() {
    return (
        <Layout>
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <WhyChooseUs />
            <SponsorsSection />
            <CTASection />
        </Layout>
    );
}