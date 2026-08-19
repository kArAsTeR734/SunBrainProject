import { Breadcrumbs } from '@widgets/breadcrumbs';

import { CalendarSlider } from '@/widgets/calendar-slider';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

export const StudentCalendarPage = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumbs />
      </div>
      <CalendarSlider />
      <Footer />
    </>
  );
};
