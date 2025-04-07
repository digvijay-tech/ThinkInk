import express from "express";
import { registerOrLoginUser } from "../controllers/auth.controller";
const router = express.Router();

// Registers the new user and will login the existing user
router.post("/authenticate", registerOrLoginUser);

export default router;
