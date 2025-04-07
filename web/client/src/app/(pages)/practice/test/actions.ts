"use client";

import React, { SetStateAction } from "react";

export const fakeStreamResponse = async (set: React.Dispatch<SetStateAction<string>>) => {
  // simulating fake streamed response
  return new Promise<void>((resolve) => {
    const text =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit aut quod modi nam culpa quibusdam est, quaerat veritatis eos illo! Maiores tempora perspiciatis, nostrum nemo odit exercitationem laboriosam nihil id!";
    const words = text.split(" ");

    let i = 0;

    const interval = setInterval(() => {
      if (i < words.length) {
        set((prev) => prev + words[i] + " ");
        i++;
      } else {
        clearInterval(interval);
        resolve(); // streaming complete
      }
    }, 300);
  });
};

export const streamTaskResponse = async (skill: string, task: string, set: React.Dispatch<SetStateAction<string>>) => {
  const data = localStorage.getItem("auth");

  if (!data) {
    console.error("No auth data found in localStorage");
    throw new Error("Authentication required. Please log in.");
  }

  let auth;

  try {
    auth = JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse auth data:", e);
    throw new Error("Invalid authentication data.");
  }

  if (!auth || !auth.token) {
    throw new Error("No valid authentication token available.");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-task`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify({ skill, task }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch task: ${response.status} - ${errorText}`);
  }

  if (!response.body) {
    console.error("Response body is null or undefined");
    throw new Error("No response body received from server");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";

  try {
    while (true) {
      const { value, done } = await reader.read();

      // stream completed
      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      const parsedChunk = JSON.parse(chunk);
      console.log("Parsed chunk received:", parsedChunk);

      // treating the chunks as the plain text and appending directly
      accumulatedText += parsedChunk.response;

      // updating task state with each chunk
      set(accumulatedText);
    }
  } catch (e) {
    console.error("Error while reading stream:", e);
    throw e;
  } finally {
    reader.releaseLock();
  }
};
