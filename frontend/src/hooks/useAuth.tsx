import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/app.store';
import { clearAuthInfo, selectAuth } from '../app/features/auth/auth.slice';

export default function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const { accessToken, profileInfo } = auth;

  const isAuthenticated = Boolean(accessToken);

  const logout = useCallback(() => {
    dispatch(clearAuthInfo());
  }, [dispatch]);

  return {
    logout,
    accessToken,
    isAuthenticated,
    profileInfo: profileInfo,
  };
}
