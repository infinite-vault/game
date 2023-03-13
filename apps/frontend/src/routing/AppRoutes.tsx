import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { GamePage } from '../pages/Game/GamePage';
import { LoginPage } from '../pages/Login/LoginPage';
import { NotFoundPage } from '../pages/NotFound/NotFoundPage';
import { RootPage } from '../pages/Root/RootPage';
import { NoAuthOnly } from './NoAuthOnly';
import { RequireAuth } from './RequireAuth';

export enum RoutePaths {
  ROOT = '/',
  LOGIN = '/login',
  DASHBOARD = '/dashboard',
  CHARACTER_NEW = '/character/new',
  CHARACTER_EDIT = '/character/edit',
  GAME = '/game',
  DUNGEON_SELECT = '/dungeon/select',
}

export const AppRoutes = () => (
  <Routes>
    <Route path={RoutePaths.ROOT} element={<RootPage />} />

    <Route
      path={RoutePaths.LOGIN}
      element={
        <NoAuthOnly>
          <LoginPage />
        </NoAuthOnly>
      }
    />

    <Route
      path={RoutePaths.DASHBOARD}
      element={
        <RequireAuth>
          <DashboardPage />
        </RequireAuth>
      }
    />

    <Route
      path={`${RoutePaths.GAME}/:gameId`}
      element={
        <RequireAuth>
          <GamePage />
        </RequireAuth>
      }
    />

    <Route
      path="*"
      element={
        <RequireAuth>
          <NotFoundPage />
        </RequireAuth>
      }
    />
  </Routes>
);
