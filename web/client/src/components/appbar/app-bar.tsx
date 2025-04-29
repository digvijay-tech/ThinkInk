"use client";

import { LogoutButton } from "../logout-button/logout-button";

export function AppBar() {
  return (
    <div className="py-4 px-2 select-none">
      <div className="mx-4 md:container md:mx-auto flex flex-row items-center justify-between border-b pb-4">
        <div className="flex flex-row items-center justify-center">
          <h2 className="text-left md:text-center scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl select-none">ThinkInk.</h2>
        </div>
        <div>
          <LogoutButton isIcon={true} />
        </div>
      </div>
    </div>
  );
}
