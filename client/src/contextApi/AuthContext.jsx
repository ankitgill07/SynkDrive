import { receiveUserData } from "@/api/AuthApi";
import { userLogoutApi } from "@/api/UserApi";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthorization = async () => {
    try {
      const result = await receiveUserData();
      if (result.success) {
        setUser(result);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const result = await userLogoutApi();
      if (result.success) {
        toast.success(result.success);
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      await checkAuthorization();
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
        checkAuthorization,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => useContext(AuthContext);
