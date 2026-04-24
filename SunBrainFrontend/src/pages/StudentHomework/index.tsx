import Footer from '@/widgets/Footer';
import Header from '@/widgets/Header';
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '@widgets/Breadcrumbs';
import { CatalogHints } from '@shared/ui';

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
