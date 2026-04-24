import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './ProfileNavigation.scss';
import React from 'react';
import useBreadcrumbs from '@shared/hooks/useAppLocation.ts';

export const ProfileNavigation = () => {
  const navigationLinks = useBreadcrumbs();
  return (
    <section className="profile-navigation">
      <nav className="profile-navigation__links">
        {navigationLinks.map((link) => (
          <React.Fragment key={link.href}>
            <a
              className="profile-navigation__link"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
            {link !== navigationLinks[navigationLinks.length - 1] && (
              <ArrowForwardIcon />
            )}
          </React.Fragment>
        ))}
      </nav>
    </section>
  );
};
