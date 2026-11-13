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
        <dl className={styles.info}>
          <div className={styles.item}>
            <dt>Имя и фамилия</dt>
            <dd>{user?.fullName ?? ''}</dd>
          </div>
          <div className={styles.item}>
            <dt>Электронная почта</dt>
            <dd>{user?.email ?? ''}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};
