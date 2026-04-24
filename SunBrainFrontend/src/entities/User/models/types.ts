export interface AvatarUpload {
  file: File;
}

export interface ProfileUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string;
}

export interface ProfileDataInterface {
  user: ProfileUser;
}

export type ProfileData = ProfileDataInterface;
