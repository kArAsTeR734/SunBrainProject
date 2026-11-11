import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { ChangeEvent, useRef, useState } from 'react';

import styles from './Avatar.module.scss';

interface AvatarProps {
  currentAvatar?: string;
  onUpload: (_file: File) => Promise<void>;
  size?: number;
}

export const Avatar = ({ currentAvatar, onUpload, size = 120 }: AvatarProps) => {
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    setUploadError('');

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setUploadError('Выберите изображение в формате JPEG, PNG, GIF или WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Размер изображения должен быть не больше 5 МБ.');
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadError('Не удалось загрузить аватар. Попробуйте ещё раз.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.avatarUpload}>
      <button
        type="button"
        className={styles.container}
        onClick={handleClick}
        style={{ width: size, height: size }}
        aria-label="Изменить аватар"
        disabled={isUploading}
      >
        {currentAvatar ? (
          <img src={currentAvatar} alt="" className={styles.image} loading="lazy" />
        ) : (
          <PersonOutlineIcon className={styles.icon} aria-hidden="true" />
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        hidden
        disabled={isUploading}
      />
      {isUploading ? (
        <p className={styles.hint} role="status">
          Загружаем аватар…
        </p>
      ) : (
        <p className={styles.hint}>Нажмите, чтобы изменить аватар</p>
      )}
      {uploadError && (
        <p className={styles.error} role="alert">
          {uploadError}
        </p>
      )}
    </div>
  );
};
