import { ProfileHeaderData } from '@features/User';
import { BurgerMenu } from '@shared/ui';
import { useState } from 'react';

import { NavbarMenu } from '@/widgets/Header/ui/NavbarMenu/NavbarMenu.tsx';

import styles from './header.module.scss';
import { Logo } from './Logo/Logo';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <section className={styles.header}>
      <div className="container">
        <header className={styles.wrapper}>
          <Logo />
          <NavbarMenu isMenuOpen={isMenuOpen} closeBurger={closeMenu} />
          <BurgerMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <ProfileHeaderData />
        </header>
      </div>
    </section>
  );
};
