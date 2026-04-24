import { Card } from '@/shared/ui';
import './catalogObjectCards.css';
import { useRouting } from '@/shared/hooks/useRouting.ts';

export const CatalogObjectCards = () => {
  const { catalogItems } = useRouting();

  return (
    <div className="catalog-cards">
      {catalogItems.map((item) => (
        <Card key={item.fullPath} {...item} />
      ))}
    </div>
  );
};
