import './ProfileDropdown.scss';
import { useProfile } from '@entities/User/models/useProfile.ts';

export const ProfileDropdown = () => {
  const { handleTest, handleLogout, handleHomeworks, handleAccount } =
    useProfile();

  return (
    <ul className="profile-dropdown">
      <li className="profile-dropdown__item" onClick={handleAccount}>
        Личный кабинет
      </li>
      <li className="profile-dropdown__item" onClick={handleHomeworks}>
        Домашние работы
      </li>
      <li className="profile-dropdown__item" onClick={handleTest}>
        Пройти тест
      </li>
      <li className="profile-dropdown__item logout" onClick={handleLogout}>
        Выйти
      </li>
    </ul>
  );
};
