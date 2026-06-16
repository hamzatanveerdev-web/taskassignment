import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [loading, setLoading] = useState(false);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    if (userData?._id) {
      localStorage.setItem('userId', userData._id);
      setUserId(userData._id);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, userId, loading, setLoading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
