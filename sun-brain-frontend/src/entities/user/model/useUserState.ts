import { useAppSelector } from '@shared/lib';

import type { UserState } from './userSlice';

export const useUserState = () => useAppSelector((state: { userReducer: UserState }) => state.userReducer);
