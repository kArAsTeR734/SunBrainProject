import { Link } from 'react-router-dom';

import styles from './Card.module.scss';

interface CardProps {
  id: string;
  fullPath: string;
  title: string;
}

export const Card = ({ id, fullPath, title }: CardProps) => {
  return (
    <Link key={id} to={fullPath}>
      <div className={styles.card}>
        <div className={styles.title}>{title}</div>
      </div>
    </Link>
  );
};
