import express from "express";
import { getModelStatus, streamTaskResponse } from "../controllers/ai-model.controller";
import { verifyUser } from "../middleware/verify-user.middleware";

const router = express.Router();

// gets the status of the model
router.get("/model-status", verifyUser, getModelStatus);

// streams the task response
router.post("/generate-task", verifyUser, streamTaskResponse);

export default router;
