// AI Model Controllers Only
import { Request, Response } from "express";
import { generateTask, isModelRunning } from "../services/ai-model.service";
import { ApiError } from "../utils/errors";

interface StreamTaskRequestBody {
    skill: string;
    task: string;
}

/**
 * Checks if the ai model is working.
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 **/
export const getModelStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const isWorking = await isModelRunning();

        if (!isWorking) throw new ApiError("Model is offline", 500);

        res.status(200).json({
            message: "Model is online.",
        });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                message: error.message,
            });
        } else {
            res.status(500).json({
                message: "Model is offline!",
            });
        }
    }
};

/**
 * Checks if skill and task is present in the request body. Reads the stream of text from generateTask service
 * and writes it to client.
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 **/
export const streamTaskResponse = async (req: Request<{}, {}, StreamTaskRequestBody>, res: Response): Promise<void> => {
    const { skill, task } = req.body;

    if (!skill || !task) {
        res.status(400).json({
            message: "Missing Skill or Task!",
        });

        return;
    }

    try {
        const stream = await generateTask(skill, task);

        // headers for streaming
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        // listening to data receive event
        stream.on("data", (chunk: Buffer) => {
            const lines = chunk.toString().split("\n").filter(Boolean);

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    res.write(json.response);
                } catch {} // skipping malformed json
            }
        });

        // listening to end stream event
        stream.on("end", () => {
            res.end();
        });

        // listening to errors
        stream.on("error", (err: any) => {
            console.error("Stream error:", err);
            res.status(500).end("Stream error");
        });
    } catch (error) {
        console.error("Task Controller Error:", error);
        res.status(500).json({ message: "Failed to generate task" });
    }
};
