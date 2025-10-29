import type { Metadata } from "next";
import "./globals.css";
import { ReactNode, ReactElement } from "react";
import localFont from "next/font/local";
import "easymde/dist/easymde.min.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";

const workSans = localFont({
  src: [
    {
      path: "./fonts/WorkSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Black.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-Thin.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/WorkSans-ExtraLight.ttf",
      weight: "100",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "StartupsLib",
  description: "Pitch, vode and grow",
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default async function RootLayout({ children }: RootLayoutProps): Promise<ReactElement<RootLayoutProps>> {
  const themeStore = await cookies();
  const themeCookie = themeStore.get("app-theme")?.value;
  const isDark = themeCookie === "dark";

  return (
    <html lang="en" className={isDark ? "dark" : undefined}>
      <body className={cn("dark:bg-black", workSans.variable)}>
        <ThemeProvider initialTheme={isDark ? "dark" : "light"}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
