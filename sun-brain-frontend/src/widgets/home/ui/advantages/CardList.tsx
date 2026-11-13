import { advantages } from '../../config/advantages';
import styles from './CardList.module.scss';

interface CardProps {
  title: string;
  description: string;
  index: number;
}

const CardItem = ({ title, description, index }: CardProps) => {
  return (
    <div className={styles.advantageCard}>
      <span className={styles.number} aria-hidden="true">
        0{index + 1}
      </span>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export const CardList = () => {
  return (
    <div className={styles.cardList}>
      {advantages.map(({ title, description }, index) => (
        <CardItem key={title} title={title} description={description} index={index} />
      ))}
    </div>
  );
};
