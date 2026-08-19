import styles from './advantages.module.scss';
import { CardList } from './CardList';

export const Advantages = () => {
  return (
    <section className={styles.advantages}>
      <div className="container">
        <div id="about" className={styles.title}>
          О нас
        </div>
        <CardList />
      </div>
    </section>
  );
};
