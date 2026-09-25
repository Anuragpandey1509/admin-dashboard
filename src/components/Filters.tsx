"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getCategories } from "@/lib/api/products";

export function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [categories, setCategories] = useState<{slug: string, name: string}[]>([]);
  
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sortBy") || "";
  const currentOrder = searchParams.get("order") || "asc";

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set("category", e.target.value);
      params.delete("q"); // DummyJSON limitation
    } else {
      params.delete("category");
    }
    params.set("page", "1"); // reset page
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val) {
      const [sortBy, order] = val.split("-");
      params.set("sortBy", sortBy);
      params.set("order", order);
    } else {
      params.delete("sortBy");
      params.delete("order");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <select
        className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
        value={currentCategory}
        onChange={handleCategoryChange}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      
      <select
        className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
        value={currentSort ? `${currentSort}-${currentOrder}` : ""}
        onChange={handleSortChange}
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="rating-desc">Rating (High to Low)</option>
        <option value="rating-asc">Rating (Low to High)</option>
        <option value="title-asc">Title (A-Z)</option>
        <option value="title-desc">Title (Z-A)</option>
      </select>
    </div>
  );
}
