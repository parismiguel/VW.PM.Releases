import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("auth", btoa(
      `${process.env.REACT_APP_BASIC_AUTH_USER}:${process.env.REACT_APP_BASIC_AUTH_PASS}`
    ));
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = (navigate) => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate('/login'); // Redirect to the login page
  };


  useEffect(() => {
    const auth = localStorage.getItem('auth');
    const storedUser = localStorage.getItem('user');
    if (auth && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}