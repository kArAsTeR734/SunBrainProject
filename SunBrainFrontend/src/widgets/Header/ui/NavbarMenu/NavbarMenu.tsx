import { NavLink } from 'react-router-dom';
import './NavbarMenu.scss';
import { navLinks } from '../../config/navbarLinks.ts';

interface NavbarProps {
  isMenuOpen: boolean;
  closeBurger: () => void;
}

export const NavbarMenu = ({ closeBurger, isMenuOpen }: NavbarProps) => {
  return (
    <nav
      id="header-navigation"
      className={`menu ${isMenuOpen ? 'menu--open' : ''}`}
      aria-label="Основная навигация"
    >
      <ul className="menu__list">
        {navLinks.map(({ label, href }) => (
          <li key={href} className="menu__item">
            <NavLink onClick={closeBurger} className="menu__item-link" to={href}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
