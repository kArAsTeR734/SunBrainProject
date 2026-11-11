import clsx from 'clsx';
import type { MouseEventHandler } from 'react';

import { getUserInitials } from '../../lib/getUserInitials';
import { useUserState } from '../../model/useUserState';
import DropdownIcon from './chevron-down.svg?react';
import styles from './ProfileTrigger.module.scss';

interface ProfileTriggerProps {
  id: string;
  menuId: string;
  isOpen: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const ProfileTrigger = ({ id, menuId, isOpen, onClick }: ProfileTriggerProps) => {
  const { user } = useUserState();

  return (
    <button
      type="button"
      className={styles.profileTrigger}
      id={id}
      aria-label="Меню профиля"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={isOpen ? menuId : undefined}
      onClick={onClick}
    >
      <span className={styles.initials} aria-hidden="true">
        {getUserInitials(user?.fullName ?? 'Пользователь')}
      </span>
      <span className={styles.username}>{user?.fullName ?? 'Пользователь'}</span>
      <span
        className={clsx(styles.dropdownIcon, isOpen && styles.open)}
        aria-hidden="true"
      >
        <DropdownIcon />
      </span>
    </button>
  );
};
