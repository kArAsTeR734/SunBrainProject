import type { ProfileUser } from '@entities/user';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  isAuth: boolean;
  isLoading: boolean;
  error: string;
  user: ProfileUser | null;
}

const initialState: UserState = {
  isAuth: false,
  isLoading: true,
  error: '',
  user: null,
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
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.isAuth = false;
      state.user = null;
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
