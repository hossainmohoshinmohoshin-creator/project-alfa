import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Voltrix Admin",
  description: "PUBG Mobile Production Panel",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
