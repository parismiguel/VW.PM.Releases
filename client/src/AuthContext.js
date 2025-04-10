import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Store Basic Authentication credentials for API requests
    const basicAuth = btoa(
      `${process.env.REACT_APP_BASIC_AUTH_USER}:${process.env.REACT_APP_BASIC_AUTH_PASS}`
    );
    localStorage.setItem("auth", basicAuth);
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async (navigate) => {
    try {
      // Clear local storage and user state
      setUser(null);
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
  
      // Redirect to the login page
      navigate('/login');
    } catch (err) {
      console.error("Error during logout:", err);
    }
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