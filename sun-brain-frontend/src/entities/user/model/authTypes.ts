import type { ProfileUser } from './types';

export interface RegistrationRequestDataInterface {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

export interface LoginResponseDataInterface {
  user: ProfileUser;
  accessToken: string;
  refreshToken: string;
}

export type LoginRequest = Omit<RegistrationRequest, 'role' | 'fullName'>;

export type AuthResponse = LoginResponseDataInterface;

export type RegistrationRequest = RegistrationRequestDataInterface;
