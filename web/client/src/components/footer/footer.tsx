"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="py-2 flex flex-col md:flex-row items-center justify-between">
        <p className="text-center text-sm">&copy; {new Date().getFullYear()} Digvijaysinh Padhiyar. All rights reserved.</p>

        <ul className="flex flex-row items-center justify-center select-none">
          <li>
            <Link href="https://github.com/digvijay-tech/" target="_blank">
              <Button size="icon" variant="ghost" className="rounded-full cursor-pointer">
                <GitHubIcon />
              </Button>
            </Link>
          </li>
          <li className="mx-2">
            <Link href="https://www.linkedin.com/in/digvijay-padhiyar-2a6a77179/" target="_blank">
              <Button size="icon" variant="ghost" className="rounded-full cursor-pointer">
                <LinkedInIcon />
              </Button>
            </Link>
          </li>
          <li>
            <Link href="https://digvijay.tech/" target="_blank">
              <Button size="icon" variant="ghost" className="rounded-full cursor-pointer">
                <LanguageIcon />
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
