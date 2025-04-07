// For verifying access token from the request header
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(401).json({
            message: "Unauthorized Access Denied!",
        });

        return;
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET as string, { algorithms: ["HS256"] });
        console.log("Middleware: ", decodedToken);
        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized Access Denied",
        });
    }
};
