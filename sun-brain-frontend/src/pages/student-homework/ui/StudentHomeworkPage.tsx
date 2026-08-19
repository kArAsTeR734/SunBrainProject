import { CatalogHints } from '@shared/ui';
import { Breadcrumbs } from '@widgets/breadcrumbs';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';

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
