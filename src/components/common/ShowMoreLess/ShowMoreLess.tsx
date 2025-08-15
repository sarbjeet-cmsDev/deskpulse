"use client";

import { Button } from "@/components/Form/Button";

interface ShowMoreLessProps {
  totalItems: number;
  visibleCount: number;
  step: number;
  onChange: (newVisibleCount: number) => void;
}

export default function ShowMoreLess({
  totalItems,
  visibleCount,
  step,
  onChange,
}: ShowMoreLessProps) {
  const canShowMore = visibleCount < totalItems;
  const canShowLess = visibleCount > step;

  const handleShowMore = () => {
    if (canShowMore) {
      onChange(Math.min(visibleCount + step, totalItems));
    }
  };

  const handleShowLess = () => {
    if (canShowLess) {
      onChange(Math.max(visibleCount - step, step));
    }
  };

  if (totalItems <= step) return null;

  return (
    <div className="flex justify-between items-center mt-4 border-t pt-4">
      <Button
        onPress={handleShowLess}
        disabled={!canShowLess}
        className={`px-3 py-1 text-sm bg-[#f0f0f0] rounded ${!canShowLess ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Show Less
      </Button>

      <span className="text-sm text-gray-600 text-center">
        Showing {Math.min(visibleCount, totalItems)} of {totalItems}
      </span>

      <Button
        onPress={handleShowMore}
        disabled={!canShowMore}
        className={`px-3 py-1 text-sm bg-[#f0f0f0] rounded ${!canShowMore ? "cursor-not-allowed opacity-50" : ""}`}
      >
        Show More
      </Button>
    </div>
  );
}
