import { ChangeEvent, useEffect, useRef, useState } from 'react';

import styles from './Avatar.module.scss';

interface AvatarProps {
  currentAvatar?: string;
  onUpload: (_file: File) => Promise<void>;
  size?: number;
}

export const Avatar = ({ currentAvatar, onUpload, size = 120 }: AvatarProps) => {
  const [preview, setPreview] = useState<string>(currentAvatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(currentAvatar || '');
  }, [currentAvatar]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      await onUpload(file);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка при загрузке аватарки');
      setPreview(currentAvatar || '');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.avatarUpload} style={{ width: size, height: size }}>
      <div
        className={styles.container}
        onClick={handleClick}
        style={{ cursor: isUploading ? 'wait' : 'pointer' }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Аватар"
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>👤</span>
          </div>
        )}

        <div className={styles.overlay}>
          {isUploading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            <div className={styles.change}>
              <span>Изменить</span>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className={styles.input}
        disabled={isUploading}
      />
    </div>
  );
};
