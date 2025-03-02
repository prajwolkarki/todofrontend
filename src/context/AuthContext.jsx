import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetch(`process.env.BACKEND_URL/api/users/status`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated); 
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
