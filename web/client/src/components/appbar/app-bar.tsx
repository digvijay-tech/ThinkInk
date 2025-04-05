"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "../logout-button/logout-button";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetClose, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

const links = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Practice", path: "/practice" },
  { label: "Account", path: "/account" },
];

export function AppBar() {
  const pathname = usePathname();

  return (
    <Sheet>
      <div className="py-4 px-2 select-none">
        <div className="mx-4 md:container md:mx-auto flex flex-row items-center justify-between border-b pb-4">
          <div className="flex flex-row items-center justify-center">
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="cursor-pointer">
                <Menu />
              </Button>
            </SheetTrigger>

            <div className="mx-1"></div>

            <h2 className="text-left md:text-center scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl select-none">ThinkInk.</h2>
          </div>

          <div>
            <LogoutButton isIcon={true} />
          </div>
        </div>
      </div>

      <SheetContent className="select-none">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Choose Wisely.</SheetDescription>
        </SheetHeader>

        <nav className="select-none">
          {links.map((link, index) => (
            <SheetClose key={index} asChild>
              <Link href={link.path}>
                <p className={`text-sm font-semibold py-3 px-4 ${pathname === link.path && "bg-gray-50"} hover:bg-gray-50`}>{link.label}</p>
              </Link>
            </SheetClose>
          ))}
        </nav>

        <SheetFooter>
          <div className="text-center py-4 border-t select-none">
            <p className="text-sm text-muted-foreground mb-2">&copy; {new Date().getFullYear()} Digvijaysinh Padhiyar. All rights reserved.</p>

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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
