import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sean & Anna | Our Wedding",
  description: "Celebrate with Sean and Anna. Find wedding details, RSVP, and take a little quiz before the big day.",
  icons: { icon: "/monogram.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
