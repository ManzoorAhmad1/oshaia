import AllEvents from '@/components/event/allEvent';
import EventCard from '@/components/event/eventCard';
import EventsGrid from '@/components/event/EventsGrid';
import { HeroCarousel } from '@/components/home';

const Event = () => {
  return (
    <div>
      <HeroCarousel />
      <AllEvents />
      <EventsGrid />
    </div>
  );
};

export default Event;