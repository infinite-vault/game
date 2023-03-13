import { useAtomValue } from 'jotai';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authAtom } from '../store/authState';
import { RoutePaths } from './AppRoutes';

interface NoAuthOnlyProps {
  children: ReactNode | ReactNode[];
  redirectTo?: RoutePaths;
}

export const NoAuthOnly = ({ children, redirectTo = RoutePaths.DASHBOARD }: NoAuthOnlyProps): JSX.Element => {
  const isAuthenticated = useAtomValue(authAtom);
  return isAuthenticated ? <Navigate to={redirectTo} /> : <>{children}</>;
};
