import { CatalogHints } from '@shared/ui';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import styles from './objectsCatalog.module.scss';

export const ObjectsCatalog = ({ breadcrumbs }: { breadcrumbs: ReactNode }) => {
  return (
    <section className={styles.objectsCatalog}>
      <div className="container">
        {breadcrumbs}
        <CatalogHints />
        <Outlet />
      </div>
    </section>
  );
};
