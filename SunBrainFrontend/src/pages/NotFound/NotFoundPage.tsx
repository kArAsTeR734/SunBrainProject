import './NotFound.scss';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1 className="not-found__header">По вашему запросу ничего не найдено</h1>
      <Link to="/" className="not-found__link">
        Вернуться на главную
      </Link>
    </div>
  );
};
