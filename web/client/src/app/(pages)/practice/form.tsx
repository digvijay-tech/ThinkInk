"use client";

import Link from "next/link";
import React, { useState } from "react";
import { skills, taskMap } from "./data";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

export function SelectForm() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleSkillChange = (newVal: string) => {
    // reset task when skill is changed
    setSelectedTask(null);
    setSelectedSkill(newVal);
  };

  return (
    <div className="my-3 py-4 w-full md:w-3/4 md:mx-auto">
      <div className="w-full md:w-3/4 md:mx-auto">
        <div>
          <Label htmlFor="skillSelector" className="mb-2">
            Please Select a Skill
          </Label>
          <Select onValueChange={handleSkillChange}>
            <SelectTrigger className="w-full" id="skillSelector">
              <SelectValue placeholder="Select a skill." />
            </SelectTrigger>
            <SelectContent>
              {skills.map((skill, index) => (
                <SelectItem key={index} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3">
          {selectedSkill && (
            <>
              <Label htmlFor="taskSelector" className="mb-2">
                Select a task from below
              </Label>

              <Select onValueChange={setSelectedTask} disabled={!selectedSkill}>
                <SelectTrigger className="w-full" id="taskSelector">
                  <SelectValue placeholder="Select a task." />
                </SelectTrigger>
                <SelectContent>
                  {taskMap.get(selectedSkill)?.map((task, index) => (
                    <SelectItem key={index} value={task}>
                      {task}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>

        {selectedSkill && selectedTask && (
          <div className="mt-6 text-left">
            <Link href={`/practice/test?skill=${selectedSkill}&task=${selectedTask}`}>
              <Button type="submit" className="w-full md:w-max select-none cursor-pointer">
                Let&apos;s Begin <ArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
