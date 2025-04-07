// Authentication/Authorization Controllers Only
import { Request, Response } from "express";
import mongoose from "mongoose";
import { isAddress } from "ethers";
import { Users } from "../models/user";
import { ApiError } from "../utils/errors";

interface AuthRequestBody {
    wAddr: string;
}

/**
 * Authentication is handled on the client with metamask. When client succeeds user document
 * is created if no user found with the same address. If address is already there,then
 * `lastLogin` property is updated.
 *
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

        // attempt to register the new user in the db
        if (!user) {
            const result = await Users.create({ walletAddress: wAddr });

            if (!result) throw new ApiError("Failed to register user! Please try again later.", 500);

            res.status(200).json({ message: "Account Registered!" });
            return;
        }

        // user already exists, mark the last login
        const updated = await Users.findByIdAndUpdate({ _id: user._id }, { lastLogin: Date.now() }, { new: true });

        if (!updated) throw new ApiError("Failed to update last login!", 500);

        res.status(200).json({ message: "Logged in successfully!" });
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
