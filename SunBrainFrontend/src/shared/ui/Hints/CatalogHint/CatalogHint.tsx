import './catalogHint.css';

const CatalogHint = () => {
  const catalogHints = [
    {
      number: 1,
      imgSrc: '/src/assets/formulaHint.svg',
      title: 'Вспоминай формулы по каждой теме',
    },
    {
      number: 2,
      imgSrc: '/src/assets/taskHint.svg',
      title: 'Решай новые задачи каждый день',
    },
  ];
  return (
    <>
      {catalogHints.map(({ number, imgSrc, title }) => (
        <div className="catalog-hint" key={number}>
          <div className="catalog-hint__img">
            <img src={imgSrc} alt="" />
            <span className="catalog-hint__number">{number}</span>
          </div>
          <div className="catalog-hint__title">{title}</div>
        </div>
      ))}
    </>
  );
};

export default CatalogHint;
