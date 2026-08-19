import type { AvatarUpload, ProfileData } from '@entities/user';
import { request } from '@shared/api';
import { api } from '@shared/api/config/api.config.ts';

export class UserService {
  public static async getUserInfo(): Promise<ProfileData> {
    return request(api.get('/api/profile/me'));
  }

  public static async uploadAvatar(file: File): Promise<AvatarUpload> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/api/profile/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }
}
