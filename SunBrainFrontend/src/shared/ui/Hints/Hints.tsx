import CatalogHint from '@/shared/ui/Hints/CatalogHint/CatalogHint.tsx';

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
