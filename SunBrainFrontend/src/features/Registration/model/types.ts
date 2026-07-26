import type { ProfileUser } from '@entities/User';

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

export interface RegistrationFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role?: string;
}

export type LoginRequest = Omit<RegistrationRequest, 'role' | 'fullName'>;

export type AuthResponse = LoginResponseDataInterface;

export type RefreshResponse = Omit<LoginResponseDataInterface, 'user'>;

export type RegistrationRequest = RegistrationRequestDataInterface;
