import { Link, NavLink } from 'react-router-dom';
import './header.scss';
import logo from '@/assets/logo.svg';
import { NavbarMenu } from '@/widgets/Header/ui/NavbarMenu/NavbarMenu.tsx';
import { ProfileHeaderData } from '@features/User';
import { useState } from 'react';
import { BurgerMenu } from '@shared/ui';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <section className="header">
      <div className="container">
        <header className="header__wrapper">
          <div className="header__logo">
            <NavLink to="/" className="icon">
              <img src={logo} alt="searchIcon" />
            </NavLink>
            <Link to="/" className="header__logo-name">
              SunBrain
            </Link>
          </div>
          <NavbarMenu isMenuOpen={isMenuOpen} closeBurger={closeMenu} />
          <BurgerMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <ProfileHeaderData />
        </header>
      </div>
    </section>
  );
};
