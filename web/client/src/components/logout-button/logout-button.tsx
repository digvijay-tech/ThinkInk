"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "../ui/button";
import LogoutIcon from "@mui/icons-material/Logout";


export function LogoutButton({ isIcon }: { isIcon: boolean }) {
  const { setAccount } = useAuth();

  const logout = () => {
    setAccount(null);
    document.cookie = "account=; path=/; max-age=0";
    document.cookie = "signature=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <div>
      {
        (isIcon)
        ?
        <Button onClick={logout} variant="outline" size="icon" className="text-red-400 hover:text-red-600 select-none cursor-pointer">
          <LogoutIcon />
        </Button>
        :
        <Button onClick={logout} variant="outline" className="text-red-400 hover:text-red-600 select-none cursor-pointer">
          <LogoutIcon /> Logout
        </Button>
      }
    </div>
  );
}
