import { CatalogHints } from '@shared/ui';
import { Breadcrumbs } from '@widgets/Breadcrumbs';
import { Outlet } from 'react-router-dom';

import styles from './objectsCatalog.module.scss';

export const ObjectsCatalog = () => {
  return (
    <section className={styles.objectsCatalog}>
      <div className="container">
        <Breadcrumbs />
        <CatalogHints />
        <Outlet />
      </div>
    </section>
  );
};
