import clsx from 'clsx';

import { getUserInitials } from '../../lib/getUserInitials';
import { useUserState } from '../../model/useUserState';
import DropdownIcon from './chevron-down.svg?react';
import styles from './ProfileTrigger.module.scss';

interface ProfileTriggerProps {
  isOpen: boolean;
}

export const ProfileTrigger = ({ isOpen }: ProfileTriggerProps) => {
  const { user } = useUserState();

  return (
    <div className={styles.profileTrigger}>
      <div className={styles.initials}>
        <p>{getUserInitials(user?.fullName ?? 'Иван Иванович')}</p>
      </div>
      <div className={styles.username}>
        <p>{user?.fullName ?? 'Пользователь'}</p>
      </div>
      <div className={clsx('icon', styles.dropdownIcon, isOpen && styles.open)}>
        <DropdownIcon />
      </div>
    </div>
  );
};
