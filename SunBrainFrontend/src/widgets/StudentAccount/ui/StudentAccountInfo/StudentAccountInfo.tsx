import './studentAccountInfo.scss';
import { useAvatar } from '@entities/User';
import { useAppSelector } from '@shared/lib';
import { Avatar } from '@features/User';

export const StudentAccountInfo = () => {
  const uploadAvatarMutation = useAvatar();
  const { user } = useAppSelector((state) => state.userReducer);
  const handleUpload = async (file: File) => {
    await uploadAvatarMutation.mutateAsync(file);
  };
  return (
    <>
      <div className="general">
        <h2 className="general__header">Общая информация</h2>
        <Avatar currentAvatar={user?.avatarUrl ?? ''} onUpload={handleUpload} size={150} />
        <div className="general__info">
          <p className="general__info_item">ФИО: {user?.fullName ?? ''}</p>
          <p className="general__info_item">Адрес электронной почты: {user?.email ?? ''}</p>
        </div>
      </div>
    </>
  );
};
