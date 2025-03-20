"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";

export function WalletAuthButton() {
  const { account, setAccount } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // connecting with wallet
  const connectWithMetaMaskWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // requesting account access from MetaMask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);

        setAccount(accounts[0]);
        console.log("Connected account:", accounts[0]);
        setOpen(false);
      } catch (err) {
        console.log(err);
        setError("Failed to connect wallet");
        setOpen(true);
      }
    } else {
      setError("Please install MetaMask!");
      setOpen(true);
    }
  };

  // verifying and completing the authentication
  const signMessage = async () => {
    if (!account) return;

    try {
      if (!window.ethereum) {
        setError("No wallet provider found. Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = "Authenticate with ThinkInk";
      const signature: string = await signer.signMessage(message);
      console.log("Signature:", signature);

      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() === account.toLowerCase()) {
        console.log("Signature verified!");

        // setting cookies for middleware to check auth state
        document.cookie = `account=${account}; path=/; max-age=3600`; // 1 hour
        document.cookie = `signature=${signature}; path=/; max-age=3600`; // 1 hour
        window.location.href = "/dashboard"; // redirect to a protected route

        setOpen(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Signature failed: Request canceled or a network error occurred.");
        setOpen(true);
        return;
      }

      setError("Signature failed!");
      setOpen(true);
    }
  };

  return (
    <div className="select-none">
      {!account ? (
        <div className="text-center">
          <Button onClick={connectWithMetaMaskWallet} className="cursor-pointer">
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Button onClick={signMessage} className="cursor-pointer">
            Sign Message
          </Button>
        </div>
      )}

      {error && (
        <Dialog open={open}>
          <DialogClose />

          <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-red-400">Oops! Something Went Wrong</DialogTitle>
            </DialogHeader>

            <DialogDescription>{error}</DialogDescription>

            <DialogFooter>
              <Button className="cursor-pointer" variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
