import { Link } from 'react-router-dom';
import './Card.scss';

interface CardProps {
  id: string;
  fullPath: string;
  title: string;
}

export const Card = ({ id, fullPath, title }: CardProps) => {
  return (
    <Link key={id} to={fullPath}>
      <div className="card">
        <div className="card__title">{title}</div>
      </div>
    </Link>
  );
};
