import { CatalogHints } from '@shared/ui';
import { Breadcrumbs } from '@widgets/Breadcrumbs';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';

export const StudentHomeworkPage = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Breadcrumbs />
        <CatalogHints />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};
