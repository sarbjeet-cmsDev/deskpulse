"use client";
import { Button } from "@/components/Form/Button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

//   if (totalPages <= 1) return null; 

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-4 border-t pt-4">
      <Button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm bg-[#f0f0f0] rounded cursor"
      >
        Previous
      </Button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>

      <Button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm bg-[#f0f0f0] rounded cursor"
      >
        Next
      </Button>
    </div>
  );
}
