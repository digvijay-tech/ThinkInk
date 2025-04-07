import { Readable } from "stream";
import axios from "axios";

/**
 * Generates a writing task tailored to a specific skill and task type using a language model
 *
 * @param {string} skill
 * @param {string} task
 * @returns {Promise<ReadableStream>} A stream of generated text from the model in response to the prompt
 **/
export const generateTask = async (skill: string, task: string): Promise<Readable> => {
    const taskPrompt = `
        Generate a writing task specifically for practicing ${skill}.
        The task must focus on writing a ${task}. Do not deviate from this topic.
        - The task should be clear, engaging, and achievable within 10 minutes.
        - Do not include examples, samples, or ask the user about time limits.
        - The scenario must directly relate to the '${task}' task. Do not generate a different type of task.
        - Do not include internal reasoning, explanations, or thought processes.
        - Do not introduce or justify the task before presenting it.
        - Only return the final structured response.
        - Do not use any html or markdown markup.
        - Do not add any indentation or space formatting.
        - Output format:
        Task Title: Start and end the title with '' (e.g., 'Persuasive Email to a Client')
        Brief Task Description: A short paragraph explaining what the user needs to do.
        Bullet Points for Tips (if necessary): Provide short, practical tips to help the user complete the task.
    `;

    const response = await axios.post(
        process.env.MODEL_GEN_URL as string,
        {
            model: process.env.MODEL_NAME as string,
            prompt: taskPrompt,
            stream: true,
        },
        { responseType: "stream" },
    );

    return response.data;
};

/**
 * Checks if the model is running by visiting the specified url.
 *
 * @returns {Promise<Boolean>} boolean
 **/
export const isModelRunning = async (): Promise<boolean> => {
    const response = await axios.get(process.env.MODEL_STATUS_URL as string);

    if (response.status === 200) {
        return true;
    }

    return false;
};
