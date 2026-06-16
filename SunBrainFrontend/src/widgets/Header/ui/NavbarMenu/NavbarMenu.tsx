import { NavLink } from 'react-router-dom';
import { navLinks } from '@/shared/constants/navbarLinks.ts';
import './NavbarMenu.scss';

interface NavbarProps {
  isMenuOpen: boolean;
  closeBurger: () => void;
}

const NavbarMenu = ({ closeBurger, isMenuOpen }: NavbarProps) => {
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

export default NavbarMenu;
