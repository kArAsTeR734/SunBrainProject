import { NavLink } from 'react-router-dom';

import { navLinks } from '../../config/navbarLinks.ts';
import styles from './NavbarMenu.module.scss';

interface NavbarProps {
  isMenuOpen: boolean;
  closeBurger: () => void;
}

export const NavbarMenu = ({ closeBurger, isMenuOpen }: NavbarProps) => {
  return (
    <nav
      id="header-navigation"
      className={`${styles.menu} ${isMenuOpen ? styles.open : ''}`}
      aria-label="Основная навигация"
    >
      <ul className={styles.list}>
        {navLinks.map(({ label, href }) => (
          <li key={href} className={styles.item}>
            <NavLink onClick={closeBurger} className={styles.itemLink} to={href}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
