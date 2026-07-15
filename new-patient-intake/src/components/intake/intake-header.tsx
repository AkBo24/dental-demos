"use client";

import { BrandWordmark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/brand/theme-toggle";

export function IntakeHeader({ quiet = false }: { quiet?: boolean }) {
  return (
    <header
      className={
        quiet
          ? "sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "border-b border-border/40 bg-transparent"
      }
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <BrandWordmark />
        <ThemeToggle />
      </div>
    </header>
  );
}
