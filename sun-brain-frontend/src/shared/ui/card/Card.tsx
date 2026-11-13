import { Link } from 'react-router-dom';

import styles from './Card.module.scss';

interface CardProps {
  id: string;
  fullPath: string;
  title: string;
}

export const Card = ({ id, fullPath, title }: CardProps) => {
  return (
    <Link key={id} to={fullPath} className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        ↗
      </span>
      <span className={styles.title}>{title}</span>
    </Link>
  );
};
