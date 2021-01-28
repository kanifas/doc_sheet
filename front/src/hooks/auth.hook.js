import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [isReady, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwt, id) => {
    setToken(jwt);
    setUserId(id);
    localStorage.setItem(storageName, JSON.stringify({ jwt, id }));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.jwt) {
      login(data.jwt, data.id);
    }
    setReady(true);
  }, [login]);

  return { login, logout, token, userId, isReady };
};
