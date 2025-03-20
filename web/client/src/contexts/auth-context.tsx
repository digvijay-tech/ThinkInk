"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  account: string | null;
  setAccount: (account: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);

  // user is authenticated if they have an account and have signed a message
  const isAuthenticated = !!account;

  return <AuthContext.Provider value={{ account, setAccount, isAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
