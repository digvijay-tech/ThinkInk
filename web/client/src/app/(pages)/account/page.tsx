import { Metadata } from "next";
import { AppBar } from "@/components/appbar/app-bar";

// SEO Config
export const metadata: Metadata = {
  title: "Account | ThinkInk",
  description: "This is your ThinkInk Account page."
}


export default function Account() {
  return (
    <main>
      <AppBar />

      <p className="">Account</p>
    </main>
  );
}
