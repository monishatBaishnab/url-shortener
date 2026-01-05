import { Fragment, type ReactNode } from 'react';
import { Navigate } from 'react-router';

interface Props {
  children: ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Fragment>{children}</Fragment>;
}
