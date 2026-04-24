import { Link } from 'react-router-dom';
import './UserAuthPlaceholder.scss';

export const UserAuthPlaceholder = () => {
  return (
    <div className="auth-placeholder">
      <h1 className="auth-placeholder__title">
        Ошибка! Войдите или зарегистрируйтесь, для доступа к этой странице
      </h1>
      <Link className="auth-placeholder__link" to="/login">
        Вернуться ко входу
      </Link>
    </div>
  );
};
