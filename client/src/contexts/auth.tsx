import React, { useCallback, useContext, useState } from 'react';
import type { AuthInfo } from '@/types/auth';

interface AuthContext {
  authInfo: AuthInfo | null;
  updateAuthInfo: (authInfo: AuthInfo | null) => void;
}

const AUTH_INFO_KEY = '@fd-challenge/authInfo';

const AuthContext = React.createContext<AuthContext>({
  authInfo: null,
  updateAuthInfo: () => void 0,
});

const AuthContextProvider: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(
    JSON.parse(window.localStorage.getItem(AUTH_INFO_KEY) as string),
  );
  const updateAuthInfo = useCallback((newAuthInfo: AuthInfo | null) => {
    if (newAuthInfo === null) {
      window.localStorage.removeItem(AUTH_INFO_KEY);
    } else {
      window.localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(newAuthInfo));
    }

    setAuthInfo(newAuthInfo);
  }, []);

  return <AuthContext.Provider value={{ authInfo, updateAuthInfo }}>{children}</AuthContext.Provider>;
};

const memorizedAuthContextProvider = React.memo(AuthContextProvider);

export const useAuthContext = () => useContext(AuthContext);

export { memorizedAuthContextProvider as AuthContextProvider };
