import { forwardRef } from 'react';

import styles from './BurgerMenu.module.scss';

interface BurgerProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const BurgerMenu = forwardRef<HTMLButtonElement, BurgerProps>(function BurgerMenu(
  { isMenuOpen, toggleMenu },
  ref,
) {
  return (
    <button
      className={`${styles.burgerMenu} ${isMenuOpen ? styles.open : ''}`}
      ref={ref}
      type="button"
      aria-controls="header-navigation"
      aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
      aria-expanded={isMenuOpen}
      onClick={toggleMenu}
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  );
});
