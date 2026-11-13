import { useAvatar } from '@entities/user';
import { useUserState } from '@entities/user';
import { Avatar } from '@features/user';

import styles from './studentAccountInfo.module.scss';

export const StudentAccountInfo = () => {
  const uploadAvatarMutation = useAvatar();
  const { user } = useUserState();
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
          <p className={styles.item}><span>ФИО</span>{user?.fullName ?? ''}</p>
          <p className={styles.item}>
            <span>Адрес электронной почты</span>{user?.email ?? ''}
          </p>
        </div>
      </div>
    </>
  );
};
