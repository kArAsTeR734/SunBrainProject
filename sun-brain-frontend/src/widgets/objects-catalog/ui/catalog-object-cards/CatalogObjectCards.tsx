import { useSubjectPath } from '@features/catalog';

import { Card } from '@/shared/ui';

import styles from './catalogObjectCards.module.scss';

export const CatalogObjectCards = () => {
  const { catalogItems } = useSubjectPath();

  return (
    <section className={styles.subjects}>
      <h1 className={styles.title}>Каталог заданий</h1>
      <p className={styles.description}>
        Выберите предмет и переходите к практике по темам.
      </p>
      <div className={styles.catalogCards}>
        {catalogItems.map((item) => (
          <Card key={item.fullPath} {...item} />
        ))}
      </div>
    </section>
  );
};
