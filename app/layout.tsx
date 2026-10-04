import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Dead Stock Dost", description: "Find the stock that's getting stuck." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body suppressHydrationWarning>{children}</body></html>;
}
