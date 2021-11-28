import React, { useCallback, useContext, useState } from 'react';

interface AuthContext {
  accessToken: string | null;
  updateAccessToken: (accessToken: string | null) => void;
}

const ACCESS_TOKEN_KEY = '@fd-challenge/accessToken';

const AuthContext = React.createContext<AuthContext>({
  accessToken: null,
  updateAccessToken: () => void 0,
});

const AuthContextProvider: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(window.localStorage.getItem(ACCESS_TOKEN_KEY));
  const updateAccessToken = useCallback((newAccessToken: string | null) => {
    if (newAccessToken === null) {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    } else {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    }

    setAccessToken(newAccessToken);
  }, []);

  return <AuthContext.Provider value={{ accessToken, updateAccessToken }}>{children}</AuthContext.Provider>;
};

const memorizedAuthContextProvider = React.memo(AuthContextProvider);

export const useAuthContext = () => useContext(AuthContext);

export { memorizedAuthContextProvider as AuthContextProvider };
