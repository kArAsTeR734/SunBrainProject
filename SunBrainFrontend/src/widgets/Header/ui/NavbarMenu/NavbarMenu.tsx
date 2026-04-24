import { NavLink } from 'react-router-dom';
import { navLinks } from '@/shared/constants/navbarLinks.ts';
import './NavbarMenu.scss';

const NavbarMenu = () => {
  return (
    <nav className="menu">
      <ul className="menu__list">
        {navLinks.map(({ label, href }) => (
          <li key={href} className="menu__item">
            <NavLink className="menu__item-link" to={href}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarMenu;
