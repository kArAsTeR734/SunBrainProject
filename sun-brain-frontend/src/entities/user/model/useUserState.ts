import { useSelector } from 'react-redux';

import type { UserState } from './userSlice';

export const useUserState = () => useSelector((state: { userReducer: UserState }) => state.userReducer);
