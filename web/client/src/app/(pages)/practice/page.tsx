import { Metadata } from "next";
import { AppBar } from "@/components/appbar/app-bar";

// SEO Config
export const metadata: Metadata = {
  title: "Practice | ThinkInk",
  description: "This is ThinkInk Practice Page."
};

export default function Practice() {
  return (
    <main>
      <AppBar />

      <p className="">Practice</p>
    </main>
  );
}
