"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";


interface AuthContextType {
  account: string | null;
  signature: string | null;
  isAuthenticated: boolean;
  setAuthState: (acc: string, sign: string) => void;
  removeAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  // user is authenticated if they have an account and have signed a message
  const isAuthenticated = !!account;

  // set authenticated state
  const setAuthState = async (acc: string, sign: string) => {
    setAccount(acc);
    setSignature(sign);

    // setting cookies for middleware to check auth state
    document.cookie = `account=${acc}; path=/; max-age=3600`; // 1 hour
    document.cookie = `signature=${sign}; path=/; max-age=3600`; // 1 hour

    // storing account and signature in LS to survive hard reload
    localStorage.setItem("auth", JSON.stringify({ account: acc, signature: sign }));
  }

  // remove authenticated state
  const removeAuthState = () => {
    setAccount(null);
    setSignature(null);
    
    document.cookie = "account=; path=/; max-age=0";
    document.cookie = "signature=; path=/; max-age=0";

    // removing auth from LS
    localStorage.removeItem("auth");
  }

  // reinstate lost authentication state
  useEffect(() => {
    if (!account || !signature) {
      // restore from LS
      const data = localStorage.getItem("auth");

      // auth is null, don't do anything
      if (!data) {
        return;
      }

      try {
        const auth = JSON.parse(data);

        // payload isn't recognized
        if (!auth.account || !auth.signature) throw new Error("JSON Parsing Error: Unidentified auth payload.");

        setAccount(auth.account);
        setSignature(auth.signature);
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log("Something went wrong!");
        }
      }
    }
  }, [account, signature]);


  return <AuthContext.Provider value={{ account, signature, isAuthenticated, setAuthState, removeAuthState }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
