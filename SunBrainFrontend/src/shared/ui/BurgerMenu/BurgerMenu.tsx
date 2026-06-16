import './BurgerMenu.scss';

interface BurgerProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const BurgerMenu = ({ isMenuOpen, toggleMenu }: BurgerProps) => {
  return (
    <button
      className={`burger-menu ${isMenuOpen ? 'burger-menu--open' : ''}`}
      type="button"
      aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
      aria-expanded={isMenuOpen}
      onClick={toggleMenu}
    >
      <span className="burger-menu__line" />
      <span className="burger-menu__line" />
      <span className="burger-menu__line" />
    </button>
  );
};
