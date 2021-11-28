import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/auth';
import { routes } from '@/routes';

const ProtectedPage: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  const { authInfo } = useAuthContext();

  return !authInfo ? <Navigate to={routes.LOGIN.path} replace /> : <>{children}</>;
};

export default React.memo(ProtectedPage);
