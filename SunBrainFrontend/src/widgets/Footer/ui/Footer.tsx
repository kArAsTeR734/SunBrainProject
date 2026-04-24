import './footer.scss';
import { aboutLinks, studyLinks } from '@/shared/constants/footerLinks.ts';

export const Footer = () => {
  return (
    <section className="footer">
      <div className="container">
        <div className="footer__wrapper">
          <div className="footer__item">
            <h3 className="footer__header">О SunBrain</h3>
            {aboutLinks.map(({ href, label }) => (
              <div key={label} className="footer__item">
                <a href={href} className="footer__link">
                  {label}
                </a>
              </div>
            ))}
          </div>
          <div className="footer__item">
            <h3 className="footer__header">Учеба в SunBrain</h3>
            {studyLinks.map(({ href, label }) => (
              <div key={label} className="footer__item">
                <a href={href} className="footer__link">
                  {label}
                </a>
              </div>
            ))}
          </div>
          <div className="footer__item">
            <h3 className="footer__header">Свяжитесь с нами</h3>
            <a href="tel:+88003020412" className="footer__link">
              +7 (499) 922-89-74
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
