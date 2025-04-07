// Adding custom fields to request object
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: string | JwtPayload;
    }
}
