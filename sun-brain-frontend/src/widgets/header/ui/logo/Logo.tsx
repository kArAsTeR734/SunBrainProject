import LogoIcon from '@shared/assets/logo.svg?react';
import { Link, NavLink } from 'react-router-dom';

import styles from './logo.module.scss';

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
