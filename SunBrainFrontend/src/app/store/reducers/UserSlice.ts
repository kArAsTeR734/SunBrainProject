import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AuthorizationService } from '@/api/services/AuthorizationService.ts';
import { ProfileUser } from '@entities/User/models/types.ts';
import { Leaderboard } from '@entities/Leaderboard/types.ts';

export interface UserState {
  isAuth: boolean;
  isLoading: boolean;
  user: ProfileUser | null;
  leaderboard: Leaderboard | null;
}

const initialState: UserState = {
  isAuth: false,
  isLoading: true,
  user: null,
  leaderboard: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<ProfileUser | null>) => {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setLeaderboard: (state, action: PayloadAction<Leaderboard>) => {
      state.leaderboard = action.payload;
    },
    logout: (state) => {
      AuthorizationService.logout();
      localStorage.removeItem('access_token');
      state.isAuth = false;
      state.user = null;
      state.leaderboard = null;
      alert('Вы вышли из аккаунта!');
    },
  },
});

export default userSlice.reducer;
