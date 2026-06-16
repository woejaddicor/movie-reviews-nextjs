"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavLayout() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <>
      <Link
        href="/dashboard"
        className={`text-white [html[data-theme='light']_&]:text-gray-800 no-underline font-medium text-base px-4 py-2 rounded-lg transition-all duration-200 ${
          hoveredLink === "dashboard"
            ? "bg-white/15 [html[data-theme='light']_&]:bg-gray-200 -translate-y-px"
            : "bg-transparent"
        }`}
        onMouseEnter={() => setHoveredLink("dashboard")}
        onMouseLeave={() => setHoveredLink(null)}
      >
        Dashboard
      </Link>
      <Link
        href="/reviews"
        className={`text-white [html[data-theme='light']_&]:text-gray-800 no-underline font-medium text-base px-4 py-2 rounded-lg transition-all duration-200 ${
          hoveredLink === "reviews"
            ? "bg-white/15 [html[data-theme='light']_&]:bg-gray-200 -translate-y-px"
            : "bg-transparent"
        }`}
        onMouseEnter={() => setHoveredLink("reviews")}
        onMouseLeave={() => setHoveredLink(null)}
      >
        Reviews
      </Link>
    </>
  );
}
