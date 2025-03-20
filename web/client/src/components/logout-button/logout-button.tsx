"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import LogoutIcon from "@mui/icons-material/Logout";

export function LogoutButton() {
  const { setAccount } = useAuth();

  const logout = () => {
    setAccount(null);
    document.cookie = "account=; path=/; max-age=0";
    document.cookie = "signature=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <div>
      <Button onClick={logout} variant="destructive" className="select-none cursor-pointer">
        <LogoutIcon /> Logout
      </Button>
    </div>
  );
}
