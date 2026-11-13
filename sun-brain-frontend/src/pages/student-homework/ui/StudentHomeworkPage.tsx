import { CatalogHints } from '@shared/ui';
import { Breadcrumbs } from '@widgets/breadcrumbs';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

import styles from './StudentHomeworkPage.module.scss';

export const StudentHomeworkPage = () => {
  return (
    <>
      <Header />
      <main className={`container ${styles.content}`}>
        <Breadcrumbs />
        <CatalogHints />
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
