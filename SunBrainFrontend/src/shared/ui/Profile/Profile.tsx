import './Profile.scss';
import { useRef } from 'react';
import { useHover } from '@shared/hooks/useHover.ts';
import { ProfileDropdown, ProfileTrigger } from '@entities/User';

export const Profile = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isHovering = useHover<HTMLDivElement>(ref);
  return (
    <div className="profile">
      <div ref={ref} className="profile__container">
        <ProfileTrigger />
        {isHovering && <ProfileDropdown />}
      </div>
    </div>
  );
};
