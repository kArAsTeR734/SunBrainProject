import { Breadcrumbs } from '@widgets/breadcrumbs';

import { CalendarSlider } from '@/widgets/calendar-slider';
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

import styles from './StudentPersonalCalendarPage.module.scss';

export const StudentCalendarPage = () => {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.content}>
        <div className="container">
          <Breadcrumbs />
        </div>
        <CalendarSlider />
      </main>
      <Footer />
    </div>
  );
};
