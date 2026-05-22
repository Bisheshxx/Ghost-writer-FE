import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show } from "@clerk/nextjs";
import TanStackQueryProvider from "@/shared/providers/tan-stack-query.provider";
import AppShell from "@/components/app-shell";
import { Toaster } from "sonner";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Ghost Writer",
  description: "Job tracker and application workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} antialiased`}>
        <ClerkProvider
          signInFallbackRedirectUrl="/"
          signInUrl="/sign-in"
          signUpFallbackRedirectUrl="/"
          signUpUrl="/sign-up"
        >
          <TanStackQueryProvider>
            <Show when="signed-in">
              <AppShell>{children}</AppShell>
            </Show>
            <Show when="signed-out">
              <main className="min-h-screen w-full">{children}</main>
            </Show>
          </TanStackQueryProvider>
        </ClerkProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
