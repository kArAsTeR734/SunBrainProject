import CatalogHint from '@/shared/ui/hints/catalog-hint/CatalogHint.tsx';

import styles from './Hints.module.scss';

export const CatalogHints = () => {
  return (
    <>
      <div className={styles.hints}>
        <CatalogHint />
      </div>
    </>
  );
};
