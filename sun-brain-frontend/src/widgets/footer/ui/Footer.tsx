import { aboutLinks, studyLinks } from '../config/footerLinks.ts';
import styles from './footer.module.scss';

export const Footer = () => {
  return (
    <section className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.item}>
            <h3 className={styles.header}>О SunBrain</h3>
            {aboutLinks.map(({ href, label }) => (
              <div key={label} className={styles.item}>
                <a href={href} className={styles.link}>
                  {label}
                </a>
              </div>
            ))}
          </div>
          <div className={styles.item}>
            <h3 className={styles.header}>Учеба в SunBrain</h3>
            {studyLinks.map(({ href, label }) => (
              <div key={label} className={styles.item}>
                <a href={href} className={styles.link}>
                  {label}
                </a>
              </div>
            ))}
          </div>
          <div className={styles.item}>
            <h3 className={styles.header}>Свяжитесь с нами</h3>
            <a href="tel:+88003020412" className={styles.link}>
              +7 (499) 922-89-74
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
