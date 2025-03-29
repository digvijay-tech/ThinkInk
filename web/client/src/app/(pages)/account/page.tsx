import { Metadata } from "next";
import { AppBar } from "@/components/appbar/app-bar";
import { AccountDetails } from "./account-details";


// SEO Config
export const metadata: Metadata = {
  title: "Account | ThinkInk",
  description: "This is your ThinkInk Account page."
}


export default function Account() {
  return (
    <main>
      <AppBar />

      <AccountDetails />
    </main>
  );
}
