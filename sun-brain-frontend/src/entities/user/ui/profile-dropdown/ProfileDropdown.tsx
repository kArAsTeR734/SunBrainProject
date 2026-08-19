import { useProfileDropdown } from '@entities/user/model/useProfileDropdown.ts';

import styles from './ProfileDropdown.module.scss';

export const ProfileDropdown = () => {
  const { handleTest, handleLogout, handleHomeworks, handleAccount } =
    useProfileDropdown();

  return (
    <ul className={styles.profileDropdown}>
      <li className={styles.item} onClick={handleAccount}>
        Личный кабинет
      </li>
      <li className={styles.item} onClick={handleHomeworks}>
        Домашние работы
      </li>
      <li className={styles.item} onClick={handleTest}>
        Пройти тест
      </li>
      <li className={`${styles.item} ${styles.logout}`} onClick={handleLogout}>
        Выйти
      </li>
    </ul>
  );
};
