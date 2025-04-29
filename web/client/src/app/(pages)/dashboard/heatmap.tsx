"use client";

import { useEffect, useState } from "react";
import { ReactGithubHeatmap } from "@ahmaddzidnii/react-github-heatmap";
import axiosInstace from "@/axios";
import { Skeleton } from "@/components/ui/skeleton";

type HeatMapData = {
  date: string;
  contributions: number;
};

export function Heatmap() {
  const [data, setData] = useState<HeatMapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    (async function () {
      try {
        const res = await axiosInstace.get("/api/stats");

        if (res.status !== 200) {
          throw new Error("Failed to load stats!");
        }

        // normalizing streaks
        const original: HeatMapData[] = res.data.streaks;

        if (original.length < 1) {
          setData([]);
        } else {
          const newStreaks = original.map((streak) => {
            return {
              date: streak.date.split("T")[0],
              contributions: 3,
            };
          });

          setData(newStreaks);
        }
        console.log(original[0].date.split("T")[0]);
      } catch (e) {
        console.log(e);
      }
    })();

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="mt-2 flex items-center justify-left w-full">
        <div className="flex items-center justify-stretch space-x-4 w-full">
          <div className="space-y-2 w-full">
            <Skeleton className="h-8 w-[100%]" />
            <Skeleton className="h-8 w-[100%]" />
            <Skeleton className="h-8 w-[70%]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-left">
      <ReactGithubHeatmap
        data={data}
        tooltipContent={(t) => {
          if (!t.contributions) {
            return `No attempt on ${t.date}`;
          }

          return `${t.date}`;
        }}
        tooltipOptions={{
          place: "top",
        }}
      />
    </div>
  );
}
