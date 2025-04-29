// Authentication/Authorization Controllers Only
import { Request, Response } from "express";
import mongoose from "mongoose";
import { isAddress } from "ethers";
import { Users } from "../models/user";
import { ApiError } from "../utils/errors";
import { generateAccessToken } from "../services/auth.service";

interface AuthRequestBody {
    wAddr: string;
}

/**
 * Authentication is handled on the client with metamask. When client succeeds user document
 * is created if no user found with the same address. If address is already there,then
 * `lastLogin` property is updated.
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 **/
export const registerOrLoginUser = async (req: Request<{}, any, AuthRequestBody>, res: Response): Promise<void> => {
    const { wAddr } = req.body;

    if (!wAddr) {
        res.status(400).json({ message: "Missing Wallet Address!" });
        return;
    }

    if (!isAddress(wAddr)) {
        res.status(400).json({ message: "Invalid Wallet Address!" });
        return;
    }

    try {
        // find if the user exists
        const user = await Users.findOne({ walletAddress: wAddr }).lean();

        // attempt to register the new user
        if (!user) {
            const newUser = await Users.create({ walletAddress: wAddr });

            if (!newUser) throw new ApiError("Failed to register user! Please try again later.", 500);

            // signing access token
            const accessToken = generateAccessToken({ userId: newUser._id });

            res.status(200).json({
                message: "Account Registered!",
                token: accessToken,
                user: {
                    lastLogin: newUser.lastLogin,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                },
            });

            return;
        }

        // user already exists, mark the last login
        const updated = await Users.findByIdAndUpdate({ _id: user._id }, { lastLogin: Date.now() }, { new: true });

        if (!updated) throw new ApiError("Failed to update last login!", 500);

        // signing access token
        const accessToken = generateAccessToken({ userId: updated._id });

        // inserting new streak if it is not present
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayStreaks = updated.streaks.find((streak) => {
            const streakDate = new Date(streak.date);
            streakDate.setHours(0, 0, 0, 0);
            return streakDate.getTime() === today.getTime();
        });

        if (!todayStreaks) {
            const sterakUpdate = await Users.findByIdAndUpdate(
                { _id: updated._id },
                {
                    $push: {
                        streaks: {
                            date: today,
                            contributions: 1,
                        },
                    },
                },
                { new: true },
            );

            if (!sterakUpdate) throw new ApiError("Failed to update last login!", 500);

            res.status(200).json({
                message: "Logged-in..",
                token: accessToken,
                user: {
                    lastLogin: sterakUpdate.lastLogin,
                    createdAt: sterakUpdate.createdAt,
                    updatedAt: sterakUpdate.updatedAt,
                },
            });

            return;
        }

        //  default when streak is already there
        res.status(200).json({
            message: "Logged-in..",
            token: accessToken,
            user: {
                lastLogin: updated.lastLogin,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
            },
        });
    } catch (error: any) {
        // for known errors
        if (error instanceof ApiError) {
            res.status(error.statusCode).send({ message: error.message });
            return;
        }

        // mongodb error
        if (error instanceof mongoose.Error) {
            res.status(400).json({ message: error.message });
            return;
        }

        // for unknown errors
        res.status(500).json({
            message: "Something went wrong, please try again later!",
        });
    }
};
