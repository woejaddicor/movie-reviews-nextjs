import "../globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Reviews - Login",
  description: "Minimal film review dashboard",
  icons: {
    icon: "/favicon.svg",
  },
};

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-black text-[#d0cfd6]">{children}</body>
    </html>
  );
}
