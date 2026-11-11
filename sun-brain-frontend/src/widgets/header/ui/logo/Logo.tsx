import { Link } from 'react-router-dom';

import styles from './logo.module.scss';
import LogoIcon from './logo.svg?react';

export const Logo = () => (
  <Link to="/" className={styles.logo}>
    <LogoIcon aria-hidden="true" />
    <span>SunBrain</span>
  </Link>
);
