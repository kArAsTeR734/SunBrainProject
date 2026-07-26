import { Card } from '@/shared/ui';
import './catalogObjectCards.scss';
import { useSubjectPath } from '@features/Catalog';

export const CatalogObjectCards = () => {
  const { catalogItems } = useSubjectPath();

  return (
    <div className="catalog-cards">
      {catalogItems.map((item) => (
        <Card key={item.fullPath} {...item} />
      ))}
    </div>
  );
};
