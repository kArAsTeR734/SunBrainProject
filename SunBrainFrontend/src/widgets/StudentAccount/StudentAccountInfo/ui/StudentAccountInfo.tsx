import './studentAccountInfo.css';
import { useAvatar } from '@entities/User/models/useAvatar.ts';
import { useAppSelector } from '@shared/hooks/redux.ts';
import { AvatarUpload } from '@features/User';

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
        <AvatarUpload
          currentAvatar={user?.avatarUrl ?? ''}
          onUpload={handleUpload}
          size={150}
        />
        <div className="general__info">
          <div className="general__info_item">ФИО: {user?.fullName ?? ''}</div>
          <div className="general__info_item">
            Адрес электронной почты: {user?.email ?? ''}
          </div>
        </div>
      </div>
    </>
  );
};
