"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";
import UserProfileMenu from "@/components/user-profile-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const navigation = [
  { href: "/", label: "Jobs", icon: LayoutDashboard },
  { href: "/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/qualification", label: "Qualification", icon: GraduationCap },
  { href: "/skills", label: "Skills", icon: BarChart3 },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/account", label: "Account", icon: UserRound },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <div className="flex h-full flex-col justify-between">
            <SidebarHeader className="border-b border-sidebar-border p-3">
              <Link
                href="/"
                className="flex size-7 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground transition-transform hover:scale-[1.02]"
                aria-label="Ghost Writer home"
              >
                {/* <Sparkles className="size-4" /> */}
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2 flex flex-col justify-center items-center">
              <SidebarMenu className="gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="h-10 justify-center px-0"
                        tooltip={item.label}
                      >
                        <Link href={item.href} aria-label={item.label}>
                          <Icon className="size-4" />
                          <span className="sr-only">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarContent>
          </div>
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex flex-col items-center justify-center gap-2">
              <ThemeToggle />
              <UserProfileMenu />
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 pb-24 md:pb-0">
          {children}
        </SidebarInset>
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-3 bottom-3 z-50 md:hidden"
        >
          <div className="mx-auto flex max-w-sm items-center justify-between rounded-xl border border-border/80 bg-background/95 p-1.5 shadow-lg shadow-foreground/10 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl p-2 transition-colors",
                    active && "bg-primary text-primary-foreground shadow-sm",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              );
            })}
            <ThemeToggle className="ml-1" />
            <UserProfileMenu side="top" className="ml-1" />
          </div>
        </nav>
      </SidebarProvider>
    </TooltipProvider>
  );
}
