import { verifyAuthSession } from "../../lib/auth";
import { redirect } from "next/navigation";
import UserDropdown from "../../components/user-dropdown";
import NavLayout from "../../components/nav-items";
import { ThemeProvider } from "../../components/theme-provider";
import { getUserById } from "../../lib/user";
import { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const result = await verifyAuthSession();

  if (!result.user) {
    return redirect("/");
  }

  const user = getUserById(parseInt(result.user.id));

  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ThemeProvider>
          <div className="h-full flex flex-col">
            <header className="bg-black/40 dark:bg-black/40 light:bg-white backdrop-blur-sm border-b border-white/10 dark:border-white/10 light:border-gray-200 shadow-lg sticky top-0 z-50 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-gray-200 [html[data-theme='light']_&]:shadow-md">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  <nav className="flex gap-8 items-center">
                    <NavLayout />
                  </nav>
                  <div className="relative z-50">
                    <UserDropdown user={user} />
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
