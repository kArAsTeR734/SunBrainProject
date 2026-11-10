import { Link, NavLink } from 'react-router-dom';

import styles from './logo.module.scss';
import LogoIcon from './logo.svg?react';

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <NavLink to="/" className={styles.icon} aria-label="SunBrain">
        <LogoIcon />
      </NavLink>
      <Link to="/" className={styles.name}>
        SunBrain
      </Link>
    </div>
  );
};
