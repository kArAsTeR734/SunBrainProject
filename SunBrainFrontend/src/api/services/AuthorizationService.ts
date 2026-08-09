import type {
  AuthResponse,
  LoginRequest,
  RefreshResponse,
  RegistrationRequest,
} from '@features/Registration';
import { request } from '@shared/api';

import { authApi } from '@/api/config/api.config.ts';

export class AuthorizationService {
  public static async login(data: LoginRequest): Promise<AuthResponse> {
    return request(authApi.post('/api/auth/login', data));
  }

  public static async register(data: RegistrationRequest): Promise<AuthResponse> {
    return request(authApi.post('/api/auth/register', data));
  }

  public static async refresh(): Promise<RefreshResponse> {
    return request(authApi.post('/api/auth/refresh'));
  }

  public static async logout(): Promise<void> {
    await authApi.post('/api/auth/logout');
  }
}
