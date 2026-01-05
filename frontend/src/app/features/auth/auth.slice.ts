import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app.store';
import type { AuthInitialState } from './auth.types';

const initialState: AuthInitialState = {
  accessToken: undefined,
  profileInfo: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.accessToken = action.payload;
    },
    setProfileInfo: (state, action) => {
      state.profileInfo = action.payload;
    },
    clearAuthInfo: (state) => {
      state.accessToken = undefined;
      state.profileInfo = undefined;
    },
  },
});

export const { setAuth, clearAuthInfo, setProfileInfo } = authSlice.actions;
export const authReducer = authSlice.reducer;

/* ------ Selectors ------ */
export const selectAuth = (state: RootState) => state.auth;
