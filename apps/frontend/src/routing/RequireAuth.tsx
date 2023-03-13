import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { RoutePaths } from './AppRoutes';
import { useAtomValue } from 'jotai';
import { authAtom } from '../store/authState';

interface RequireAuthProps {
  children: ReactNode | ReactNode[];
  redirectTo?: string;
}

export const RequireAuth = ({ children, redirectTo = RoutePaths.ROOT }: RequireAuthProps): JSX.Element => {
  const isAuthenticated = useAtomValue(authAtom);
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
};
