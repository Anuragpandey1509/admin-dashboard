"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, Menu, X } from "lucide-react";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string; image: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
    } else if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/products" className="flex items-center gap-2 font-bold text-xl text-gray-800 dark:text-white">
            <Package className="h-6 w-6 text-blue-600" />
            Admin Panel
          </Link>
          <button className="lg:hidden text-gray-500" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            href="/products"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === "/products" 
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="h-10 w-10 rounded-full bg-gray-200" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                U
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName || "Admin User"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-4 sm:px-6 lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 font-semibold text-gray-800 dark:text-white truncate">
            Admin Panel
          </span>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
