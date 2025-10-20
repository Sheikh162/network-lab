// src/components/Navbar.tsx

import Link from "next/link";
import { LineComponent } from "./LineComponent";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/">
          <h1 className="cursor-pointer text-lg font-medium text-foreground">
            NodeLabs
          </h1>
        </Link>
        <ThemeToggle />
      </div>
      <LineComponent/>
    </header>
  );
}