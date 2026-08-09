import { Link } from 'react-router-dom';

import styles from './UserAuthPlaceholder.module.scss';

export const UserAuthPlaceholder = () => {
  return (
    <div className={styles.authPlaceholder}>
      <h1 className={styles.title}>
        Ошибка! Войдите или зарегистрируйтесь, для доступа к этой странице
      </h1>
      <Link className={styles.link} to="/login">
        Вернуться ко входу
      </Link>
    </div>
  );
};
