"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  total: number;
}

export function Pagination({ total }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const totalPages = Math.ceil(total / limit);

  const updateUrl = (newPage: number, newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    params.set("limit", newLimit.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrev = () => {
    if (page > 1) updateUrl(page - 1, limit);
  };

  const handleNext = () => {
    if (page < totalPages) updateUrl(page + 1, limit);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl(1, parseInt(e.target.value, 10));
  };

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-semibold">{start}</span>–<span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{total}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-gray-700 dark:text-gray-300">
            Per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
