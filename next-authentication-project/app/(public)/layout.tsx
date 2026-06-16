import "../globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Auth - Login",
  description: "Next.js Authentication",
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
