import { ProfileDropdown, ProfileTrigger } from '@entities/user';
import { useHover } from '@shared/lib';
import { useRef } from 'react';

import styles from './Profile.module.scss';

export const Profile = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isHovering = useHover<HTMLDivElement>(ref);
  return (
    <div className={styles.profile}>
      <div ref={ref} className={styles.container}>
        <ProfileTrigger isOpen={isHovering} />
        {isHovering && <ProfileDropdown />}
      </div>
    </div>
  );
};
