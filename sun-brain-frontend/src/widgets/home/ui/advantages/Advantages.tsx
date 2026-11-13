import styles from './advantages.module.scss';
import { CardList } from './CardList';

export const Advantages = () => {
  return (
    <section className={styles.advantages}>
      <div className="container">
        <p className={styles.eyebrow} id="about">
          УЧИТЬСЯ С SUNBRAIN
        </p>
        <h2 className={styles.title}>Всё для вашей подготовки</h2>
        <p className={styles.description}>
          Понятный маршрут от проверки знаний до самостоятельной практики.
        </p>
        <CardList />
      </div>
    </section>
  );
};
