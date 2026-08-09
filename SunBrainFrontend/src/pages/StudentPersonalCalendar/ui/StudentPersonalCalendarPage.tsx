import { Breadcrumbs } from '@widgets/Breadcrumbs';

import { CalendarSlider } from '@/widgets/CalendarSlider';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';

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
