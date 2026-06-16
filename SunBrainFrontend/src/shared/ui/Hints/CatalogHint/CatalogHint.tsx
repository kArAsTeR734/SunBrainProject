import './catalogHint.scss';
import formulaHint from '@/assets/formulaHint.svg';
import taskHint from '@/assets/taskHint.svg';

const CatalogHint = () => {
  const catalogHints = [
    {
      number: 1,
      imgSrc: formulaHint,
      title: 'Вспоминай формулы по каждой теме',
    },
    {
      number: 2,
      imgSrc: taskHint,
      title: 'Решай новые задачи каждый день',
    },
  ];
  return (
    <>
      {catalogHints.map(({ number, imgSrc, title }) => (
        <div className="catalog-hint" key={number}>
          <div className="catalog-hint__img">
            <img src={imgSrc} alt="formulaHint" loading="lazy" />
            <span className="catalog-hint__number">{number}</span>
          </div>
          <div className="catalog-hint__title">{title}</div>
        </div>
      ))}
    </>
  );
};

export default CatalogHint;
