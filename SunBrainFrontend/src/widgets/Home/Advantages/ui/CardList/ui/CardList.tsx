import './CardList.scss';
import { advantages } from '@shared/constants/advantages.ts';

interface CardProps {
  title: string;
  description: string;
}

const CardItem = ({ title, description }: CardProps) => {
  return (
    <div className="advantage-card">
      <div className="advantage-card__title">{title}</div>
      <div className="advantage-card__description">{description}</div>
    </div>
  );
};

export const CardList = () => {
  return (
    <div className="card-list">
      {advantages.map(({ title, description }) => (
        <CardItem key={title} title={title} description={description} />
      ))}
    </div>
  );
};
