import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Community Chat Application",
  description:
    "Connect people by creating communities with people have similar interests.They can chat and share their thoughts.Using Text,Audio and Video chat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
