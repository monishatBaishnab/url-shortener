import useAuth from '@/hooks/useAuth';
import { Fragment, type ReactNode } from 'react';
import { Navigate } from 'react-router';

interface Props {
  children: ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const { accessToken } = useAuth();
  const isAuthenticated = !!accessToken;

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Fragment>{children}</Fragment>;
}
