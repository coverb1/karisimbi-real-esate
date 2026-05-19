"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { cn } from "@/src/lib/utils";

export function MegaMenuGrid({
  columns,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { columns?: 1 | 2 }) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5 text-popover-foreground",
        columns === 2
          ? "grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-10 gap-y-1 min-w-0 [&>*]:min-w-0"
          : "flex flex-col gap-0.5 w-full min-w-[12.5rem]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function MegaMenuColumn({
  title,
  className,
  children,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 flex flex-col gap-1", className)}>
      {title && (
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-mid px-0.5 pb-2 mb-0.5 border-b border-line/80">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-0.5 pt-1">{children}</div>
    </div>
  );
}

export function MegaMenuNavLink({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group/item flex w-full min-h-11 flex-row items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium leading-snug text-gray-dark",
          "transition-colors duration-150",
          "hover:bg-subtle hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2",
          className,
        )}
      >
        <span
          aria-hidden
          className="inline-flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-primary/25 ring-2 ring-primary/15 transition-colors group-hover/item:bg-primary group-hover/item:ring-primary/30"
        />
        <span className="min-w-0 flex-1 text-left">{label}</span>
      </Link>
    </NavigationMenuLink>
  );
}

export function MegaMenuFooter({
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 bg-subtle/90 border-t border-line backdrop-blur-sm",
        className,
      )}
    >
    </div>
  );
}
