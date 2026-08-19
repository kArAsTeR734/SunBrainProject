import { useSubjectPath } from '@features/catalog';

import { Card } from '@/shared/ui';

import styles from './catalogObjectCards.module.scss';

export const CatalogObjectCards = () => {
  const { catalogItems } = useSubjectPath();

  return (
    <div className={styles.catalogCards}>
      {catalogItems.map((item) => (
        <Card key={item.fullPath} {...item} />
      ))}
    </div>
  );
};
