"use client";

import { useEffect, useState } from "react";
import { ReactGithubHeatmap } from "@ahmaddzidnii/react-github-heatmap";


type HeatMapData = {
  date: string;
  contributions: number;
};

// dummy data
const generateData = () => {
    const data = [];

    data.push({date: "2025-03-24", contributions: 1});
    data.push({date: "2025-03-25", contributions: 2});
    data.push({date: "2025-03-26", contributions: 0});
    data.push({date: "2025-03-27", contributions: 3});
    data.push({date: "2025-03-28", contributions: 0});
    data.push({date: "2025-03-29", contributions: 1});

    return data;
}

export function Heatmap() {
  const [data, setData] = useState<HeatMapData[]>([]);

  useEffect(() => {
      const generated = generateData();
      setData(generated);
  }, []);

  if (data.length === 0) return null; // or a loading spinner

    return (
        <div className="mt-2 flex items-center justify-left">
            <ReactGithubHeatmap 
                data={data}
                tooltipContent={(t) => {
                    if (!t.contributions) {
                      return `No contributions on ${t.date}`;
                    }
          
                    return `${t.contributions} contributions on ${t.date}`;
                }}
                tooltipOptions={{
                    place: "top",
                }}
                
            />
        </div>
    );
}
