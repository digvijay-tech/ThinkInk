"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AppBar } from "@/components/appbar/app-bar";
import { Button } from "@/components/ui/button";

export default function PracticeTest() {
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill");
  const task = searchParams.get("task");

  // on load
  useEffect(() => {
    if (skill && task) {
      const payload = {
        skill: skill,
        task: task,
      };

      console.log("Ready to make API call!");
      console.log("Payload:", payload);
    }
  }, [skill, task]);

  // missing skill or task
  if (!skill || !task) {
    return (
      <main>
        <AppBar />

        <div className="mx-6 my-10 md:container md:mx-auto text-center">
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Somthing is missing!</h2>

          <p className="text-xl text-muted-foreground mt-4">
            Incomplete practice request detected! Please make sure you have select the skill and the task. If not please go back to practice page.
          </p>

          <Link href="/practice">
            <Button className="select-none cursor-pointer mt-6">Go to Practice Page</Button>
          </Link>
        </div>
      </main>
    );
  }

  // when query param requirements are okay!
  return (
    <main>
      <AppBar />

      <div className="mx-6 my-4 md:container md:mx-auto">Practice Test</div>
    </main>
  );
}
