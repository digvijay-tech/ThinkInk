"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function AccountDetails() {
  const { account } = useAuth();
  const [consent, setConsent] = useState<string>("");

  return (
    <div className="px-2">
      <div className="mx-4 md:container md:mx-auto border py-4 px-3 rounded-md mt-4">
        <h4 className="text-xl font-semibold tracking-tight">Account Details</h4>

        <Separator className="my-3" />

        <div className="">
          <Label htmlFor="accountId">Account ID</Label>
          <Input type="text" value={!account ? "Loading.." : account} disabled className="mt-2 select-none" readOnly />
        </div>

        <div className="mt-4">
          <Label htmlFor="accountId">Delete Account</Label>
          <Input
            type="text"
            className="mt-2 select-none"
            placeholder="Type 'DELETE' to continue"
            maxLength={6}
            value={consent}
            onChange={(e) => setConsent(e.target.value)}
          />
        </div>

        <Button variant="destructive" className="mt-4 cursor-pointer select-none w-full md:w-auto" disabled={consent !== "DELETE"}>
          Delete
        </Button>
      </div>
    </div>
  );
}
