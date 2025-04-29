import { Request, Response } from "express";
import { Users } from "../models/user";
import { ApiError } from "../utils/errors";

interface DecodedToken {
    userId: string;
}

// gets the remaining battery and streaks
export const getBatteryAndStreak = async (req: Request, res: Response) => {
    const data = req.user as DecodedToken;

    try {
        const user = await Users.findById({ _id: data.userId });

        if (!user) {
            throw new ApiError("Please logout and login again!", 404);
        }

        res.status(200).json({
            battery: user.battery,
            streaks: user.streaks,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                messge: error.message,
            });
        } else {
            console.error("Transaction Error:", error);
            res.status(500).json({ message: "Failed to get stats" });
        }
    }
};

// update battery after success recharge
export const rechargeBattery = async (req: Request, res: Response) => {
    const data = req.user as DecodedToken;

    try {
        const user = await Users.findByIdAndUpdate({ _id: data.userId }, { battery: 3 }, { new: true });

        if (!user) {
            throw new ApiError("Please logout and login again!", 404);
        }

        res.status(200).json({
            battery: user.battery,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                messge: error.message,
            });
        } else {
            console.error("Transaction Error:", error);
            res.status(500).json({ message: "Failed to update battery" });
        }
    }
};
