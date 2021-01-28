import { createContext } from 'react';

export const AuthContext = createContext({
  jwt: null,
  userId: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});