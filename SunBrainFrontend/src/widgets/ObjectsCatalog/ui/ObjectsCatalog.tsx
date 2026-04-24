import './objectsCatalog.css';
import { CatalogHints } from '@shared/ui';
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '@widgets/Breadcrumbs';

export const ObjectsCatalog = () => {
  return (
    <section className="objects-catalog">
      <div className="container">
        <Breadcrumbs />
        <CatalogHints />
        <Outlet />
      </div>
    </section>
  );
};
