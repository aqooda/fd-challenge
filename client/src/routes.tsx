import { RouteProps } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';

export type RouteName = 'LOGIN' | 'HOME';

export interface RouteConfig extends Required<Pick<RouteProps, 'element' | 'path'>> {
  protected?: boolean;
}

export const routes: Record<RouteName, RouteConfig> = {
  LOGIN: {
    path: '/login',
    element: <LoginPage />,
  },
  HOME: {
    path: '/',
    protected: true,
    element: <HomePage />,
  },
};
