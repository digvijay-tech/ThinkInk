import { Metadata } from "next";
import { AppBar } from "@/components/appbar/app-bar";
import { Heatmap } from "./heatmap";
import { Battery } from "./battery";


// SEO Config
export const metadata: Metadata = {
  title: "Dashboard | ThinkInk",
  description: "This is ThinkInk Dashboard Page."
};

export default function Dashboard() {
  return (
    <main>
      <AppBar />

      <div className="mx-2 my-3">
        <div className="md:container mx-4 md:mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-stretch">
            <div className="w-full">
              <h4 className="mb-2 text-xl font-semibold tracking-tight">
                Heatmap
              </h4>

              <Heatmap />
            </div>

            <div className="w-8 h-4"></div>

            <div className="w-full">
              <h4 className="mb-2 text-xl font-semibold tracking-tight">
                Battery
              </h4>

              <Battery />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
