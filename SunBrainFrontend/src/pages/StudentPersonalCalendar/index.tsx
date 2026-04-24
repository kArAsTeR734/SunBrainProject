import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import CalendarSlider from '@/widgets/CalendarSlider';
import { Breadcrumbs } from '@widgets/Breadcrumbs';

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
