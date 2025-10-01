"use client";

import { useState } from "react";
import TimelineService, { ITimeline } from "@/service/timeline.service";
import CreateTimelineModal from "./createTimelineModal";
import Pagination from "../Pagination/pagination";
import { ITask } from "@/service/task.service";
import formatMinutes from "@/utils/formatMinutes";

interface TimelineListProps {
  timelines: ITimeline[];
  task: ITask | null;
  onLogTimeClick: () => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  refreshTimelines: () => void;
  refreshTask: () => void;
}


export default function TimelineList({
  timelines,
  task,
  onLogTimeClick,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  refreshTimelines,
  refreshTask,
}: TimelineListProps) {
  const today = new Date();
  const initialTo = new Date(today);
  const initialFrom = new Date(today);
  initialFrom.setDate(today.getDate() - 6);

  const [fromDate, setFromDate] = useState<string>(
    initialFrom.toISOString().substring(0, 10)
  );
  const [toDate, setToDate] = useState<string>(
    initialTo.toISOString().substring(0, 10)
  );

  const handleCreateTimeline = async (data: {
    date: string;
    time_spent: string;
    comment?: string;
  }) => {
    try {
      await TimelineService.createTimeline({
        ...data,
        task: task?._id || "",
        user: task?.assigned_to || "",
      });
      refreshTimelines();
      refreshTask();
    } catch (error) {
      console.error("Failed to create timeline:", error);
    }
  };
  const shiftDateRange = (direction: number) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);

    from.setDate(from.getDate() + 7 * direction);
    to.setDate(to.getDate() + 7 * direction);

    setFromDate(from.toISOString().substring(0, 10));
    setToDate(to.toISOString().substring(0, 10));
    onPageChange(1);
  };

  const filteredTimelines = timelines.filter((tl) => {
    const timelineDate = new Date(tl.date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return timelineDate >= from && timelineDate <= to;
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isNextDisabled = isToday(new Date(toDate));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              {new Date(fromDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
            <span>-</span>
            <span>
              {new Date(toDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Previous 7 days"
              onClick={() => shiftDateRange(-1)}
              className="px-1 py-1 border text-gray-600 rounded"
            >
              ◀
            </button>
            <button
              aria-label="Next 7 days"
              onClick={() => shiftDateRange(1)}
              className="px-1 py-1 border text-gray-600 rounded disabled:cursor-not-allowed"
              disabled={isNextDisabled}
            >
              ▶
            </button>
          </div>
        </div>

        <CreateTimelineModal onCreate={handleCreateTimeline} />
      </div>

      <ul>
        {filteredTimelines.map((timeline) => (

          <li
            key={timeline._id}
            className="inactive flex justify-between items-center bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]"
          >
            <div className="flex items-center gap-2">

              <span className="font-sm text-gray-800 break-all overflow-hidden px-2  whitespace-pre-line">
                {timeline.comment || "Meeting"}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right text-sm text-gray-600">
                <div className="font-semibold">{formatMinutes(timeline.time_spent)}</div>
                <div>
                  {new Date(timeline.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
