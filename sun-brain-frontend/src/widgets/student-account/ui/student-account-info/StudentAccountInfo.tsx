import { useAvatar } from '@entities/user';
import { Avatar } from '@features/user';
import { useAppSelector } from '@shared/lib';

import styles from './studentAccountInfo.module.scss';

export const StudentAccountInfo = () => {
  const uploadAvatarMutation = useAvatar();
  const { user } = useAppSelector((state) => state.userReducer);
  const handleUpload = async (file: File) => {
    await uploadAvatarMutation.mutateAsync(file);
  };
  return (
    <>
      <div className={styles.general}>
        <h2 className={styles.header}>Общая информация</h2>
        <Avatar
          currentAvatar={user?.avatarUrl ?? ''}
          onUpload={handleUpload}
          size={150}
        />
        <div className={styles.info}>
          <p className={styles.item}>ФИО: {user?.fullName ?? ''}</p>
          <p className={styles.item}>
            Адрес электронной почты: {user?.email ?? ''}
          </p>
        </div>
      </div>
    </>
  );
};
