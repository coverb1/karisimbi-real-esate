"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show max 5 page numbers with ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;
    if (currentPage <= 3) return [...pages.slice(0, 4), -1, totalPages];
    if (currentPage >= totalPages - 2)
      return [1, -1, ...pages.slice(totalPages - 4)];
    return [
      1,
      -1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      -2,
      totalPages,
    ];
  };

  const visible = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200
                   text-gray-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                   hover:not-disabled:border-primary/40 hover:not-disabled:text-primary"
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </button>

      {/* Pages */}
      {visible.map((page, i) =>
        page < 0 ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-[13px] text-gray-300"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-xl border text-[13px] font-medium transition-all duration-200",
              page === currentPage
                ? "border-primary bg-primary text-white shadow-[0_4px_12px_rgba(122,34,64,0.25)]"
                : "border-gray-200 text-gray-500 hover:border-primary/40 hover:text-primary",
            ].join(" ")}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200
                   text-gray-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                   hover:not-disabled:border-primary/40 hover:not-disabled:text-primary"
      >
        <ChevronRight size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
