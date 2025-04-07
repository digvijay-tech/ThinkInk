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
