import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("authToken") !== null;
  });

  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = user?.email === "admin@greenledger.com";

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simple validation - in production, this would call a backend API
    const validCredentials =
      email === "admin@greenledger.com" && password === "admin123";

    if (validCredentials) {
      const userData = { email };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("authToken", "admin-token");
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
