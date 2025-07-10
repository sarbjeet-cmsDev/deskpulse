"use client";

import { useState } from "react";
import TimelineService, { ITimeline } from "@/service/timeline.service";
import CreateTimelineModal from "./createTimelineModal";
import Pagination from "../Pagination/pagination";
import { ITask } from "@/service/task.service";

interface TimelineListProps {
  timelines: ITimeline[];
  task: ITask | null;
  onLogTimeClick: () => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  refreshTimelines: () => void;
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
}: TimelineListProps) {
  const today = new Date();
  const dayOfWeek = today.getDay(); 
  const diffToMonday = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const firstDayOfWeek = new Date(today.setDate(diffToMonday));
  const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));

  const [fromDate, setFromDate] = useState<string>(firstDayOfWeek.toISOString().substring(0, 10));
  const [toDate, setToDate] = useState<string>(lastDayOfWeek.toISOString().substring(0, 10));

  const handleCreateTimeline = async (data: { date: string; time_spent: string; comment?: string }) => {
    try {
      await TimelineService.createTimeline({
        ...data,
        task: task?._id || "",
        user: task?.report_to || "",
      });
      refreshTimelines();
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

  const filteredTimelines = timelines.filter(tl => {
    const timelineDate = new Date(tl.date);
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return timelineDate >= from && timelineDate <= to;
  });
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{new Date(fromDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span>-</span>
            <span>{new Date(toDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>

          <div className="flex items-center gap-2">
            <button aria-label="Previous week" onClick={() => shiftDateRange(-1)} className="px-1 py-1 border text-gray-600 rounded">◀</button>
            <button aria-label="Previous week" onClick={() => shiftDateRange(1)} className="px-1 py-1 border text-gray-600 rounded">▶</button>
          </div>
        </div>

        <CreateTimelineModal onCreate={handleCreateTimeline} />
      </div>

      <ul>
        {filteredTimelines.map(timeline => (
          <li key={timeline._id} className="inactive flex justify-between items-center bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-500" />
              <span className="font-medium text-gray-800">{timeline.comment || "Meeting"}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right text-sm text-gray-600">
                <div className="font-semibold">{timeline.time_spent}h</div>
                <div>{new Date(timeline.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
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
