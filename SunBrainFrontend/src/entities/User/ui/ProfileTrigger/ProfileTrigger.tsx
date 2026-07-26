import './ProfileTrigger.scss';
import { getUserInitials } from '../../lib/getUserInitials';
import { useAppSelector } from '@shared/lib';
import DropdownIcon from '@/assets/chevron-down.svg';

export const ProfileTrigger = () => {
  const { user } = useAppSelector((state) => state.userReducer);

  return (
    <div className="profile-trigger">
      <div className="profile-trigger__initials">
        <p>{getUserInitials(user?.fullName ?? 'Иван Иванович')}</p>
      </div>
      <div className="profile-trigger__username">
        <p>{user?.fullName ?? 'Пользователь'}</p>
      </div>
      <div className="icon profile__dropdown-icon">
        <img src={DropdownIcon} alt="dropdown-icon" />
      </div>
    </div>
  );
};
