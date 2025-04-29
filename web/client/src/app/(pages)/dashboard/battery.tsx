"use client";

import Link from "next/link";
import axiosInstace from "@/axios";
import { ethers } from "ethers";
import { RECHARGE_CONTRACT_ABI, RECHARGE_CONTRACT_ADDRESS } from "@/lib/contract";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryCharging50Icon from "@mui/icons-material/BatteryCharging50";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import BatteryAlertIcon from "@mui/icons-material/BatteryAlert";

export function Battery() {
  const [currentAttempts, setCurrentAttempts] = useState(0);

  const recharge = async () => {
    try {
      // missing wallet
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum); // New ethers v6
      const signer = await provider.getSigner();

      const rechargeContract = new ethers.Contract(RECHARGE_CONTRACT_ADDRESS, RECHARGE_CONTRACT_ABI, signer);

      // calling smart contract recharge function
      const tx = await rechargeContract.recharge({
        value: ethers.parseEther("0.003"), // 0.003 ETH
      });

      console.log("Transaction sent:", tx.hash);

      await tx.wait();

      console.log("Transaction confirmed!");

      // api call to update balance
      const res = await axiosInstace.put("/api/recharge", {
        walletAddress: await signer.getAddress(),
      });

      if (res.status !== 200) {
        throw new Error("Failed to recharge battery on server.");
      }

      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const res = await axiosInstace.get("/api/stats");

        if (res.status !== 200) {
          throw new Error("Failed to load stats!");
        }

        setCurrentAttempts(res.data.battery);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <div className="border rounded-sm">
      <div className="py-6 flex flex-col justify-center items-center">
        <div>
          <div className="text-center">
            {currentAttempts > 2 && <BatteryChargingFullIcon fontSize="large" />}
            {currentAttempts === 2 && <BatteryCharging50Icon fontSize="large" />}
            {currentAttempts === 1 && <BatteryCharging20Icon fontSize="large" />}
            {currentAttempts < 1 && <BatteryAlertIcon fontSize="large" />}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {currentAttempts < 1 && "No more attempts left! Get a recharge to continue."}
            {currentAttempts === 1 && `You only have ${currentAttempts} attempt left!`}
            {currentAttempts > 1 && `You have ${currentAttempts} attempts left!`}
          </p>
        </div>

        <div className="px-3 w-full">
          <Separator className="w-full my-3" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full">
              <Button onClick={recharge} disabled={!(currentAttempts < 1)} variant="default" className="w-full cursor-pointer select-none">
                Recharge
              </Button>
            </div>

            <div className="w-4 h-4"></div>

            <div className="w-full">
              <Link href="/practice">
                <Button variant="secondary" className="w-full select-none cursor-pointer">
                  Practice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
