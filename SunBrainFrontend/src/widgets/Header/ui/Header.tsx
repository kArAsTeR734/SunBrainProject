import { Link, NavLink } from 'react-router-dom';
import './header.scss';
import NavbarMenu from '@/widgets/Header/ui/NavbarMenu/NavbarMenu.tsx';
import { ProfileHeaderData } from '@features/User';

export const Header = () => {
  return (
    <section className="header">
      <div className="container">
        <header className="header__wrapper">
          <div className="header__logo">
            <NavLink to="/" className="icon">
              <img src="/src/assets/logo.svg" alt="" />
            </NavLink>
            <Link to="/" className="header__logo--name">
              SunBrain
            </Link>
          </div>
          <NavbarMenu />
          <ProfileHeaderData />
        </header>
      </div>
    </section>
  );
};
