import mongoose, { Schema } from "mongoose";

export interface IStreaks {
    date: Date;
    contributions: number;
}

export interface IUser {
    walletAddress: string;
    battery: number;
    streaks: IStreaks[];
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        walletAddress: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        battery: {
            type: Number,
            enum: [0, 1, 2, 3],
            default: 3,
        },
        streaks: [
            {
                date: {
                    type: Date,
                    default: Date.now,
                },
                contributions: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

export const Users = mongoose.model<IUser>("Users", userSchema);
