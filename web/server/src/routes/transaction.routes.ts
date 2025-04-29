import express from "express";
import { verifyUser } from "../middleware/verify-user.middleware";
import { getBatteryAndStreak, rechargeBattery } from "../controllers/transaction.controller";

const router = express.Router();

// gets user's battery
router.get("/stats", verifyUser, getBatteryAndStreak);

// updating battery to 3 after successful recharge
router.put("/recharge", verifyUser, rechargeBattery);

export default router;
