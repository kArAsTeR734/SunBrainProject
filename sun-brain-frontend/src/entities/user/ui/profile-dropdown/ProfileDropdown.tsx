import { Menu, MenuItem } from '@mui/material';
import { PATHS } from '@shared/routes';
import { Link } from 'react-router-dom';

import { useProfileDropdown } from '../../model/useProfileDropdown';
import styles from './ProfileDropdown.module.scss';

interface ProfileDropdownProps {
  anchor: HTMLButtonElement | null;
  id: string;
  triggerId: string;
  onClose: () => void;
}

export const ProfileDropdown = ({
  anchor,
  id,
  triggerId,
  onClose,
}: ProfileDropdownProps) => {
  const { handleLogout, isLoggingOut, logoutError } = useProfileDropdown();

  return (
    <Menu
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        list: { id, 'aria-labelledby': triggerId },
        paper: { className: styles.paper },
      }}
    >
      <MenuItem component={Link} to={PATHS.STUDENT.ACCOUNT} onClick={onClose}>
        Личный кабинет
      </MenuItem>
      <MenuItem component={Link} to={PATHS.STUDENT.HOMEWORK} onClick={onClose}>
        Домашние работы
      </MenuItem>
      <MenuItem component={Link} to={PATHS.TEST} onClick={onClose}>
        Пройти тест
      </MenuItem>
      <MenuItem
        className={styles.logout}
        disabled={isLoggingOut}
        onClick={() => void handleLogout()}
      >
        {isLoggingOut ? 'Выходим…' : 'Выйти'}
      </MenuItem>
      {logoutError && (
        <li className={styles.error} role="alert">
          {logoutError}
        </li>
      )}
    </Menu>
  );
};
