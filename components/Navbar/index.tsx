"use client";

import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-end border-b bg-background/80 px-4 backdrop-blur">
      <UserButton />
    </header>
  );
}
