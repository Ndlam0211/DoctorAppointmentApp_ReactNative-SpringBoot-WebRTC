import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React, { createContext, useState, useContext } from "react";

type User = {
  name: string;
  email: string;
  photo: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const logout = async () => {
    setLoading(true);
    setTimeout(async () => {
      // logout google
      await GoogleSignin.signOut();
      // clear user data
      setUser(null);
      // route to login screen
      router.replace('/login')
      setLoading(false);
    }, 500);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
