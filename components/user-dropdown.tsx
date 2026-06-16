"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logout } from "../actions/auth-actions";
import { useTheme } from "./theme-provider";
import { SafeUser } from "../lib/types";

interface UserDropdownProps {
  user: SafeUser | undefined;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-6 py-2 bg-white/10 hover:bg-white/20 [html[data-theme='light']_&]:bg-gray-100 [html[data-theme='light']_&]:hover:bg-gray-200 text-white [html[data-theme='light']_&]:text-gray-800 border border-white/20 [html[data-theme='light']_&]:border-gray-300 cursor-pointer font-medium text-base transition-all duration-200 ${
          isOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"
        }`}
      >
        Account ▾
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-0 bg-black/40 [html[data-theme='light']_&]:bg-white backdrop-blur-sm border border-white/10 [html[data-theme='light']_&]:border-gray-300 rounded-xl w-60 shadow-xl z-50 overflow-hidden">
          <div className="block px-4 py-3 text-white [html[data-theme='light']_&]:text-gray-800 no-underline hover:bg-white/10 [html[data-theme='light']_&]:hover:bg-gray-100 border-b border-white/10 [html[data-theme='light']_&]:border-gray-200 transition-all">
            <p className="font-semibold text-white [html[data-theme='light']_&]:text-gray-900 mb-1 truncate">
              {(user && user.name) || "No name set"}
            </p>
            <p className="text-sm text-white/70 [html[data-theme='light']_&]:text-gray-600 truncate">
              {user && user.email}
            </p>
          </div>
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-white [html[data-theme='light']_&]:text-gray-800 no-underline hover:bg-white/10 [html[data-theme='light']_&]:hover:bg-gray-100 border-b border-white/10 [html[data-theme='light']_&]:border-gray-200 transition-all"
          >
            Profile
          </Link>
          <div className="px-4 py-3 border-b border-white/10 [html[data-theme='light']_&]:border-gray-200 flex justify-between items-center transition-all">
            <span className="text-white [html[data-theme='light']_&]:text-gray-800 text-base">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full border cursor-pointer relative transition-all ${
                theme === "dark"
                  ? "bg-green-400 border-green-500 shadow-lg shadow-green-500/50"
                  : "bg-gray-300 border-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full absolute top-0.5 transition-all shadow-md ${
                  theme === "dark"
                    ? "bg-green-900 left-[26px]"
                    : "bg-green-600 left-0.5"
                }`}
              />
            </button>
          </div>
          <form action={logout} className="m-0">
            <button
              type="submit"
              className="w-full text-left px-4 py-3 text-white [html[data-theme='light']_&]:text-gray-800 bg-transparent border-none cursor-pointer text-base transition-all hover:bg-white/10 [html[data-theme='light']_&]:hover:bg-gray-100"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
