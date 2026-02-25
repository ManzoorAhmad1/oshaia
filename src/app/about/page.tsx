
import SponsorsSection from '@/components/about/SponsorsSection';
import CTASection from '@/components/about/CTASection';
import HeroSection from '@/components/about/HeroSection';
import AboutSection from '@/components/about/AboutSection';
import ServicesSection from '@/components/about/ServicesSection';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import Layout from '@/components/about/layout';
import { HeroCarousel } from '@/components/home';
import Footer from '@/components/home/Footer'

export default function AboutPage() {
    return (
        <Layout>
            <HeroCarousel />
            <HeroSection />
            <AboutSection />
            <ServicesSection />
            <WhyChooseUs />
            <CTASection />
            <Footer />
        </Layout>
    );
}