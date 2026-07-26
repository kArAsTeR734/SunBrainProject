import './advantages.scss';
import { CardList } from './CardList';

export const Advantages = () => {
  return (
    <section className="advantages">
      <div className="container">
        <div id="about" className="advantages__title">
          О нас
        </div>
        <CardList />
      </div>
    </section>
  );
};
