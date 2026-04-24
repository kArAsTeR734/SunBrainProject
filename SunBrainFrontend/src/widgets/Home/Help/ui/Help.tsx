import './help.scss';

export const Help = () => {
  return (
    <section className="help">
      <div className="container">
        <div className="help__body">
          <div className="help__about">
            <h2 className="help__title">
              Поддержка учителей на <br /> каждом этапе
            </h2>
            <p className="help__description">
              На нашей платформе учителя играют важную роль в <br />{' '}
              образовательном процессе. За каждым педагогом закреплено
              определённое количество учеников, что позволяет следить за их
              успеваемостью и прогрессом. Учителя могут просматривать
              выполненные задания, оценивать их и оставлять полезные
              комментарии. Это не просто контроль — это персональная поддержка и
              советы, которые помогут каждому ученику лучше понять материал и
              усовершенствовать свои знания.
            </p>
          </div>
          <div className="help__image">
            <a href="#">
              <img
                src="/src/assets/teacher.svg"
                alt="teacher"
                loading="lazy"
                width={'581'}
                height={'546'}
              />
            </a>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </section>
  );
};
