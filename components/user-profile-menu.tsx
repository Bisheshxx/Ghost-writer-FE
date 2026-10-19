"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserDisplayName, getUserInitials } from "@/lib/user/profile";

type UserProfileMenuProps = {
  align?: "start" | "center" | "end";
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
};

export default function UserProfileMenu({
  align = "end",
  className,
  side = "right",
}: UserProfileMenuProps) {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <Skeleton className={cn("size-8 rounded-lg", className)} />;
  }

  if (!isSignedIn || !user) {
    return null;
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const displayName = getUserDisplayName({
    email,
    name: user.fullName,
  });
  const initials = getUserInitials({
    email,
    name: user.fullName,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className={cn(
            "rounded-xl border border-transparent hover:border-border hover:bg-sidebar-accent",
            className,
          )}
          aria-label="Open user profile menu"
        >
          <Avatar size="sm">
            <AvatarImage src={user.imageUrl} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.imageUrl} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-popover-foreground">
                {displayName}
              </p>
              {email ? (
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {email}
                </p>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserRound />
            Account dashboard
          </Link>
        </DropdownMenuItem>
        {/* {email ? (
          <DropdownMenuItem disabled>
            <Mail />
            {email}
          </DropdownMenuItem>
        ) : null} */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => void signOut({ redirectUrl: "/sign-in" })}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
