import AllEvents from '@/components/event/allEvent';
import EventCard from '@/components/event/eventCard';
import EventsGrid from '@/components/event/EventsGrid';
import {  HeroCarousel } from '@/components/home';
import Footer from '@/components/home/Footer'
import AdBanner from '@/components/AdBanner';

const Event = () => {
  return (
    <div>
      <HeroCarousel />
      <AllEvents />
      <AdBanner position="events" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-4" />
      <EventsGrid />
      <Footer />
    </div>
  );
};

export default Event;