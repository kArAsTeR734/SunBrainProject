import { api } from '../config/api.config.ts';
import { AvatarUpload, ProfileData } from '@entities/User/models/types.ts';
import { request } from '@shared/api/api-client.ts';

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
