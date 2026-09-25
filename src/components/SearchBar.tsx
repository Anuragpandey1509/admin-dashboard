"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") || "";
      if (query === currentQ) return; // Prevent pushing if query hasn't changed

      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
        params.delete("category"); // DummyJSON limitation
      } else {
        params.delete("q");
      }
      params.set("page", "1"); // reset to page 1
      router.push(`${pathname}?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
