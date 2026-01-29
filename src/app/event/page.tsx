import AllEvents from '@/components/event/allEvent';
import EventCard from '@/components/event/eventCard';
import EventsGrid from '@/components/event/EventsGrid';
import {  HeroCarousel } from '@/components/home';
import Footer from '@/components/home/Footer'

const Event = () => {
  return (
    <div>
      <HeroCarousel />
      <AllEvents />
      <EventsGrid />
      <Footer />
    </div>
  );
};

export default Event;