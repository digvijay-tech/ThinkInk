/* eslint-disable @typescript-eslint/no-unused-vars */
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
    throw "Authentication required. Please log in.";
  }

  let auth;
  try {
    auth = JSON.parse(data);
  } catch (e) {
    throw "Invalid authentication data.";
  }

  if (!auth || !auth.token) {
    throw "No valid authentication token available.";
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
    let errorText = "Unknown server error.";
    try {
      errorText = await response.text();
    } catch (e) {
      console.error("Failed to read error body from response:", e);
    }

    throw errorText || "Server responded with an error.";
  }

  if (!response.body) {
    throw "No response body received from server.";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let accumulatedText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;
      set(accumulatedText);
    }
  } catch (e) {
    console.error("Error while reading stream:", e);
    throw "Error while reading server response stream.";
  } finally {
    reader.releaseLock();
  }
};

export const streamFeedbackResponse = async (task: string, answer: string) => {
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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/generate-feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify({ task, answer }),
  });

  if (!response.ok) {
    const bodyText = await response.text();

    let message = "Unknown error";
    try {
      const json = JSON.parse(bodyText);
      message = json.message || JSON.stringify(json);
    } catch {
      message = bodyText;
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = "feedback.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
};
