import { advantages } from '../../config/advantages';
import styles from './CardList.module.scss';

interface CardProps {
  title: string;
  description: string;
}

const CardItem = ({ title, description }: CardProps) => {
  return (
    <div className={styles.advantageCard}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export const CardList = () => {
  return (
    <div className={styles.cardList}>
      {advantages.map(({ title, description }) => (
        <CardItem key={title} title={title} description={description} />
      ))}
    </div>
  );
};
