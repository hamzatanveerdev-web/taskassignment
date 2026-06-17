import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const login = useCallback((userData, userToken) => {
    const userId = userData?._id || userData?.id;
    
    setUser(userData);
    setToken(userToken);
    
    if (userId) {
      setUserId(userId);
      localStorage.setItem('userId', userId);
    }
    
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('lastLoginTime', Date.now().toString()); // Track login time for mobile
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setUserId(null);
    setAuthReady(false);
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('lastLoginTime');
  }, []);

  // ================= TOKEN VALIDATION ON APP LOAD =================
  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (!savedToken) {
        setAuthReady(true);
        setLoading(false);
        return;
      }

      try {
        // Validate token with backend - prevents mobile state restoration issues
        const response = await authAPI.getMe();
        
        if (response.data.success) {
          const userData = response.data.user;
          const userId = userData?._id || userData?.id;
          
          setUser(userData);
          setToken(savedToken);
          
          if (userId) {
            setUserId(userId);
            localStorage.setItem('userId', userId);
          }
          
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        // Clear invalid token - fixes mobile auth persistence bug
        logout();
      } finally {
        setAuthReady(true);
        setLoading(false);
      }
    };

    validateToken();
  }, []); // Only run on mount

  // ================= MOBILE VISIBILITY CHANGE HANDLER =================
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When app becomes visible after being hidden (mobile context switch)
      if (document.visibilityState === 'visible' && token) {
        // Optionally re-validate token when app comes to foreground
        // This prevents stale tokens after long background periods
        const validateToken = async () => {
          try {
            const response = await authAPI.getMe();
            if (!response.data.success) {
              logout();
            }
          } catch (error) {
            console.error('Token re-validation failed:', error);
            logout();
          }
        };
        
        // Only re-validate if token is older than 5 minutes
        const lastLoginTime = localStorage.getItem('lastLoginTime');
        if (lastLoginTime) {
          const fiveMinutes = 5 * 60 * 1000;
          if (Date.now() - parseInt(lastLoginTime) > fiveMinutes) {
            validateToken();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token, logout]);

  const isAuthenticated = authReady && !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, userId, loading, authReady, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
