import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relativity Analytics Center",
  description: "Decision intelligence for the mission — a unified analytics discovery experience for Relativity Space.",
  openGraph: {
    title: "Relativity Analytics Center",
    description: "Decision intelligence for the mission.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Relativity Analytics Center",
    description: "Decision intelligence for the mission.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
