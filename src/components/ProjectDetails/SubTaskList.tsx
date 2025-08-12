"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png";
import ShowMoreLess from "../common/ShowMoreLess/ShowMoreLess";

interface KanbanItem {
  title: string;
  _id?: string;
}

interface SubTasksProps {
  tasks: any[];
  kanbanList?: KanbanItem[];
  isKanban?: any;
}

const TASKS_PER_PAGE = 5;

export default function SubTasks({
  tasks,
  kanbanList,
  isKanban = true,
}: SubTasksProps) {
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {}
  );

  if (!tasks?.length) {
    return <div className="text-gray-500">No tasks available.</div>;
  }

  const uniqueStatuses = kanbanList?.length
    ? Array.from(new Set(kanbanList.map((k) => k.title.toLowerCase())))
    : Array.from(
      new Set(tasks.map((t) => t.status?.toLowerCase()).filter(Boolean))
    );

  const getVisibleCount = (status: string) =>
    visibleCounts[status] ?? TASKS_PER_PAGE;

  const handleVisibleChange = (status: string, newCount: number) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [status]: newCount,
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      // timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="space-y-8">
      {uniqueStatuses.map((status) => {
        const filteredTasks = tasks.filter(
          (task: any) => task.status?.toLowerCase() === status
        );

        if (!filteredTasks.length) return null;

        const totalItems = filteredTasks.length;
        const visibleCount = getVisibleCount(status);
        const visibleTasks = filteredTasks.slice(0, visibleCount);

        return (
          <div key={status}>
            {isKanban && (
              <div className="text-sm text-gray-500 font-semibold mb-1 capitalize">
                {status}
              </div>
            )}

            <ul>
              {visibleTasks.map((task) => (
                <li
                  key={task._id}
                  className="inactive bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]"
                >
                  <Link
                    href={`/task/${task.code}`}
                    className="flex justify-between items-center gap-2"
                  >
                    <span className="text-[#333] font-medium truncate">
                      {task.title}
                    </span>

                    <div className="flex items-center gap-4 shrink-0 ">
                      <div className="flex item-center gap-2">
                        <span className="text-[#333] font-bold">Priority:</span>
                        <span>{task.priority}</span>
                      </div>

                      <div className="flex item-center gap-2">
                        <span className="text-[#333] font-bold">Due Date:</span>
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                      <Image
                        src={info}
                        alt="Details"
                        width={20}
                        height={20}
                        className="cursor-pointer opacity-70 hover:opacity-100"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {totalItems > TASKS_PER_PAGE && (
              <div className="mt-4">
                <ShowMoreLess
                  totalItems={totalItems}
                  visibleCount={visibleCount}
                  step={TASKS_PER_PAGE}
                  onChange={(newCount) => handleVisibleChange(status, newCount)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
