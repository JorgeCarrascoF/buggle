import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import getToken from "../utils/getToken";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isTokenValid = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return exp > Date.now() / 1000;
    } catch (error) {
      console.error("Token inválido:", error);
      return false;
    }
  };
  


  useEffect(() => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      setIsLoggedIn(true);
    } else {
      logout();
    }
  }, []);

  const login = (token, userId, userData, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    localStorage.setItem("userId", userId);
    localStorage.setItem("userData", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
