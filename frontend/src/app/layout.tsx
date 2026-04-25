import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ovyu — A bit of you.",
  description: "A private digital legacy platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
