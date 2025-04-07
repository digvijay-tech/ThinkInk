"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { escape } from "validator";
import { fakeStreamResponse } from "./actions";
import { AppBar } from "@/components/appbar/app-bar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function PracticeTest() {
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill")?.trim();
  const task = searchParams.get("task")?.trim();
  const [generatedTask, setGeneratedTask] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handle submit
  const handleSubmit = async () => {
    setIsLoading(true);

    // cleaning the answer
    setAnswer(answer.trim());
    const sanitizedAnswer = escape(answer);
    console.log(sanitizedAnswer);

    setIsLoading(false);
    setAnswer("");
  };

  // handle cancellation
  const handleCancel = async () => {};

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

  // simulating stream of response from server
  useEffect(() => {
     (async function() {
      setIsLoading(true);

      await fakeStreamResponse(setGeneratedTask);

      setIsLoading(false);
    })();
  }, []);

  // missing skill or task from query param
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
    <main className="h-full lg:h-[94vh]">
      <AppBar />

      <div className="h-full lg:h-9/11 mx-6 my-4 md:container md:mx-auto">
        <div className="h-full flex flex-col lg:flex-row">
          {/* Task */}
          <div className="w-full py-3 px-3 rounded-md border select-none">
            <div className="flex flex-row justify-between items-center">
              <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Task Details
              </h3>

              <div>
                {isLoading && <Loader2 className="animate-spin text-gray-400" />}
              </div>
            </div>

            <Separator className="mt-3" />

            <ScrollArea className="h-[300px] lg:h-[95%] break-all">
              <p className="text-justify my-2 italic text-muted-foreground">
                <strong>Task: </strong>
                {task}
              </p>

              
              <p className="">
                {generatedTask}
              </p>
            </ScrollArea>
          </div>

          <div className="w-6 h-6"></div>

          {/* Input Field */}
          <div className="w-full py-3 px-2 rounded-md border">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight select-none">
              Your Answer
            </h3>

            <Separator className="mt-3" />
            
            <div className="h-[300px] lg:h-[95%]">
              <Textarea
                className="h-full resize-none border-none shadow-none"
                placeholder="Write here.."
                disabled={isLoading}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-6 flex flex-col md:flex-row justify-center items-center select-none">
          <div className="w-full md:w-max">
            <Button 
              onClick={handleCancel}
              variant="secondary" 
              className="w-full cursor-pointer"
            >
              Cancel
            </Button>
          </div>

          <div className="h-4 w-4"></div>

          <div className="w-full md:w-max">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full cursor-pointer"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
