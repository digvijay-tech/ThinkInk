import { Metadata } from "next";
import { AppBar } from "@/components/appbar/app-bar";

// SEO Config
export const metadata: Metadata = {
  title: "Dashboard | ThinkInk",
  description: "This is ThinkInk Dashboard Page."
};

export default function Dashboard() {
  return (
    <main>
      <AppBar />

      <p className="">Dashboard</p>
    </main>
  );
}
