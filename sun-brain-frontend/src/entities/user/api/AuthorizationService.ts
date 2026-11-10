import { authApi, request } from '@shared/api';

import type { AuthResponse, LoginRequest, RegistrationRequest } from '../model/authTypes';

export class AuthorizationService {
  public static async login(data: LoginRequest): Promise<AuthResponse> {
    return request(authApi.post('/api/auth/login', data));
  }

  public static async register(data: RegistrationRequest): Promise<AuthResponse> {
    return request(authApi.post('/api/auth/register', data));
  }

  public static async logout(): Promise<void> {
    await request(authApi.post('/api/auth/logout'));
  }
}
