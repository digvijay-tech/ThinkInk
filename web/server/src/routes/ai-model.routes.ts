import express from "express";
import { streamTaskFeedback, getModelStatus, streamTaskResponse } from "../controllers/ai-model.controller";
import { verifyUser } from "../middleware/verify-user.middleware";

const router = express.Router();

// gets the status of the model
router.get("/model-status", verifyUser, getModelStatus);

// streams the task response
router.post("/generate-task", verifyUser, streamTaskResponse);

// generate feedback from user's answer
router.post("/generate-feedback", verifyUser, streamTaskFeedback);

export default router;
