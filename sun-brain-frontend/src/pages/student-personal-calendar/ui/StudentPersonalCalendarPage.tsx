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
        <Breadcrumbs />
        <h1 className={styles.title}>Календарь занятий</h1>
        <CalendarSlider />
      </main>
      <Footer />
    </div>
  );
};
