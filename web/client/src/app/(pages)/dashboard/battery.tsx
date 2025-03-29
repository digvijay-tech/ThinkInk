"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import BatteryCharging50Icon from "@mui/icons-material/BatteryCharging50";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';

export function Battery() {
    const [currentAttempts, setCurrentAttempts] = useState(2);

    return (
        <div className="border rounded-sm">
            <div className="py-6 flex flex-col justify-center items-center">
                <div>
                    <div className="text-center">
                        {currentAttempts === 3 && <BatteryChargingFullIcon fontSize="large" />}
                        {currentAttempts === 2 && <BatteryCharging50Icon fontSize="large" />}
                        {currentAttempts === 1 && <BatteryCharging20Icon fontSize="large" />}
                        {currentAttempts === 0 && <BatteryAlertIcon fontSize="large" />}
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                        {currentAttempts < 1 && "No more attempts left! Get a recharge to continue."}
                        {currentAttempts > 0 && `You have ${currentAttempts} attempts left!`}
                    </p>
                </div>

                <div className="px-3 w-full">
                    <Separator className="w-full my-3" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="w-full">
                            <Button 
                                disabled={!(currentAttempts < 1)} 
                                variant="default" 
                                className="w-full cursor-pointer select-none"
                                onClick={() => setCurrentAttempts(3)}
                            >
                                Recharge
                            </Button>
                        </div>

                        <div className="w-4 h-4"></div>
                        
                        <div className="w-full">
                            <Link href="/practice">
                                <Button 
                                    variant="secondary" 
                                    className="w-full select-none cursor-pointer"
                                >
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
