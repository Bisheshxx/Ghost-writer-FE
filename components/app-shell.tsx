"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import { ClerkLoaded, UserButton } from "@clerk/nextjs";
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
                className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground transition-transform hover:scale-[1.02]"
                aria-label="Ghost Writer home"
              >
                <Sparkles className="size-4" />
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
            <ClerkLoaded>
              <div className="flex items-center justify-center">
                <UserButton />
              </div>
            </ClerkLoaded>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
