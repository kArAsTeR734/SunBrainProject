import { Link } from 'react-router-dom';

import styles from './NotFound.module.scss';

export const NotFoundPage = () => {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.header}>По вашему запросу ничего не найдено</h1>
      <Link to="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
};
