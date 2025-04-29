import { Readable } from "stream";
import axios from "axios";

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
 * Generates a tailored feedback based on given task description and user response.
 *
 * @param {string} task
 * @param {string} answer
 * @returns {Promise<ReadableStream>} A stream of generated text from the model in response to the prompt
 **/
export const generateFeedback = async (task: string, answer: string): Promise<Readable> => {
    const prompt = `
		You are an expert writing evaluator. The user completed a writing task, and your job is to provide feedback.
		Task Description: ${task}
		User's Response: ${answer}
		Provide a structured evaluation covering:
	    - Clarity and conciseness
	    - Grammar and spelling
	    - Overall effectiveness
	    - Suggestions for improvement

		Format your response as follows:
		1. Overall Feedback - A brief summary of how well the response meets the task.
		2. Strengths - List what the user did well.
		3. Areas for Improvement - Suggest ways to enhance the writing.
		4. Revised Version (Optional) - Provide a short improved version if needed.
    `;

    const response = await axios.post(
        process.env.MODEL_GEN_URL as string,
        {
            model: process.env.MODEL_NAME as string,
            prompt: prompt,
            stream: true,
        },
        { responseType: "stream" },
    );

    return response.data;
};
