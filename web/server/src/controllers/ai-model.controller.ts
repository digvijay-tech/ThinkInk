// AI Model Controllers Only
import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import { generateTask, isModelRunning, generateFeedback } from "../services/ai-model.service";
import { ApiError } from "../utils/errors";
import { Users } from "../models/user";

interface StreamTaskRequestBody {
    skill: string;
    task: string;
    answer: string;
}

interface DecodedToken {
    userId: string;
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

    const data = req.user as DecodedToken;

    try {
        // making sure user has enough battery
        const user = await Users.findById({ _id: data.userId });

        if (!user) {
            throw new ApiError("Please logout and try again later!", 400);
        }

        if (user.battery < 1) {
            throw new ApiError("Please get a recharge to continue!", 403);
        }

        // generating task
        const stream = await generateTask(skill, task);

        // headers for clean text streaming
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        stream.on("data", (chunk: Buffer) => {
            try {
                const parsed = JSON.parse(chunk.toString());

                if (parsed.response) {
                    res.write(parsed.response); // only sending the clean text
                }
            } catch (error) {
                console.error("Error parsing chunk:", error);
            }
        });

        stream.on("end", () => {
            res.end();
        });

        stream.on("error", (err: any) => {
            console.error("Stream error:", err);
            res.status(500).end("Stream error");
        });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({
                messge: error.message,
            });
        } else {
            console.error("Task Controller Error:", error);
            res.status(500).json({ message: "Failed to generate task" });
        }
    }
};

/**
 * Generates feedback based on user's answer to the given task.
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 **/
export const streamTaskFeedback = async (req: Request<{}, {}, StreamTaskRequestBody>, res: Response): Promise<void> => {
    const { task, answer } = req.body;

    if (!task || !answer) {
        res.status(400).json({ message: "Missing task or answer!" });
        return;
    }

    const data = req.user as DecodedToken;

    try {
        const user = await Users.findById({ _id: data.userId });

        if (!user) {
            throw new ApiError("User not found!", 400);
        }

        if (user.battery < 1) {
            throw new ApiError("You need a recharge", 403);
        }

        const stream = await generateFeedback(task, answer);

        let feedbackText = "";

        stream.on("data", (chunk: Buffer) => {
            try {
                const parsed = JSON.parse(chunk.toString());
                if (parsed.response) {
                    feedbackText += parsed.response;
                }
            } catch (error) {
                console.error("Error parsing chunk:", error);
            }
        });

        stream.on("end", async () => {
            // set proper headers for a direct PDF
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "attachment; filename=feedback.pdf");

            const passthrough = new PassThrough();
            passthrough.pipe(res);

            const doc = new PDFDocument();

            doc.pipe(passthrough);

            // adding title
            doc.font("Times-Bold").fontSize(26).text("ThinkInk.", {
                align: "center",
            });

            // adding subtitle
            doc.moveDown(0.5).font("Times-Roman").fontSize(12).text("by Digvijaysinh Padhiyar", {
                align: "center",
            });

            doc.moveDown(2);

            // write the feedback text into the PDF
            doc.font("Times-Roman").fontSize(12).text(feedbackText, {
                align: "left",
            });

            doc.end();

            await Users.findByIdAndUpdate(
                { _id: data.userId },
                {
                    $inc: { battery: -1 },
                },
            );
        });

        stream.on("error", (err: any) => {
            console.error("Stream error:", err);
            res.status(500).end("Stream error");
        });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Feedback Controller Error:", error);
            res.status(500).json({ message: "Failed to generate feedback" });
        }
    }
};
