"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  account: string | null;
  signature: string | null;
  isAuthenticated: boolean;
  setAuthState: (acc: string, sign: string, token: string, createdAt: string, lastLogin: string) => void;
  removeAuthState: () => void;
  createdAt: string | null;
  lastLogin: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [lastLogin, setLastLogin] = useState<string | null>(null);

  // user is authenticated if they have an account and have signed a message
  const isAuthenticated = !!account;

  // set authenticated state
  const setAuthState = async (acc: string, sign: string, tok: string, createdAt: string, lastLogin: string) => {
    setAccount(acc);
    setSignature(sign);
    setToken(tok);
    setCreatedAt(createdAt);
    setLastLogin(lastLogin);

    // setting cookies for middleware to check auth state
    document.cookie = `account=${acc}; path=/; max-age=3600`; // 1 hour
    document.cookie = `signature=${sign}; path=/; max-age=3600`; // 1 hour
    document.cookie = `token=${tok}; path=/; max-age=3600`; // 1 hour

    // storing account and signature in LS to survive hard reload
    localStorage.setItem("auth", JSON.stringify({ 
      account: acc, 
      signature: sign, 
      token: tok,
      createdAt: createdAt,
      lastLogin: lastLogin
    }));
  };

  // remove authenticated state
  const removeAuthState = () => {
    setAccount(null);
    setSignature(null);
    setToken(null);

    document.cookie = "account=; path=/; max-age=0";
    document.cookie = "signature=; path=/; max-age=0";
    document.cookie = "token=; path=/; max-age=0";

    // removing auth from LS
    localStorage.removeItem("auth");
  };

  // reinstate lost authentication state
  useEffect(() => {
    if (!account || !signature || !token) {
      // restore from LS
      const data = localStorage.getItem("auth");

      // auth is null, don't do anything
      if (!data) {
        return;
      }

      try {
        const auth = JSON.parse(data);

        // payload isn't recognized
        if (!auth.account || !auth.signature || !token) throw new Error("JSON Parsing Error: Unidentified auth payload.");

        setAccount(auth.account);
        setSignature(auth.signature);
        setToken(auth.token);
        setCreatedAt(auth.createdAt);
        setLastLogin(auth.lastLogin);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log("Something went wrong!");
        }
      }
    }
  }, [account, signature, token]);

  return <AuthContext.Provider value={{ account, signature, isAuthenticated, setAuthState, removeAuthState, createdAt, lastLogin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
