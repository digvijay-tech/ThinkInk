import { Metadata } from "next";
import { AppBar } from "@/components/appbar/app-bar";
import { SelectForm } from "./form";

// SEO Config
export const metadata: Metadata = {
  title: "Practice | ThinkInk",
  description: "This is ThinkInk Practice Page.",
};

export default function Practice() {
  return (
    <main>
      <AppBar />

      <div className="mx-6 my-3 md:container md:mx-auto text-center">
        {/* Heading and Description */}
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Ready to practice?</h2>

        <p className="text-xl text-muted-foreground mt-4">Please select a skill or topic to practice today, and we’ll begin right away.</p>

        {/* Practice Selection Form */}
        <SelectForm />
      </div>
    </main>
  );
}
