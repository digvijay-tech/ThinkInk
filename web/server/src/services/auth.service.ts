import jwt from "jsonwebtoken";

const expiresIn = "1h";

export const generateAccessToken = (payload: object) => {
    const token = jwt.sign(payload, process.env.ACCESS_SECRET as string, {
        expiresIn: expiresIn,
        algorithm: "HS256",
    });

    return token;
};

export const verifyAccessToken = (token: string): { userId: string } => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string, { algorithms: ["HS256"] });

        return decoded as { userId: string };
    } catch (err) {
        throw new Error("Invalid or expired access token");
    }
};
