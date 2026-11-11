import { ProfileHeaderData } from '@features/user';
import { BurgerMenu } from '@shared/ui';
import { useRef, useState } from 'react';

import { NavbarMenu } from '@/widgets/header/ui/navbar-menu/NavbarMenu.tsx';

import styles from './header.module.scss';
import { Logo } from './logo/Logo';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <section className={styles.header}>
      <div className="container">
        <header
          className={styles.wrapper}
          onKeyDown={(event) => {
            if (isMenuOpen && event.key === 'Escape') {
              closeMenu();
              burgerRef.current?.focus();
            }
          }}
        >
          <Logo />
          <BurgerMenu ref={burgerRef} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <NavbarMenu isMenuOpen={isMenuOpen} closeBurger={closeMenu} />
          <ProfileHeaderData />
        </header>
      </div>
    </section>
  );
};
