import styles from './BurgerMenu.module.scss';

interface BurgerProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const BurgerMenu = ({ isMenuOpen, toggleMenu }: BurgerProps) => {
  return (
    <button
      className={`${styles.burgerMenu} ${isMenuOpen ? styles.open : ''}`}
      type="button"
      aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
      aria-expanded={isMenuOpen}
      onClick={toggleMenu}
    >
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.line} />
    </button>
  );
};
