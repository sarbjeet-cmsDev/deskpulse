"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png";
import ShowMoreLess from "../common/ShowMoreLess/ShowMoreLess";
import { LuEye } from "react-icons/lu";

interface KanbanItem {
  title: string;
  _id?: string;
}

interface SubTasksProps {
  tasks: any[];
  kanbanList?: any;
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
    return <div className="text-gray-500 text-center">No tasks available.</div>;
  }

  const uniqueStatuses = kanbanList?.length
    ? Array.from(new Set(kanbanList.map((k: any) => k.title.toLowerCase())))
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

                  style={{
                    borderLeft: "8px solid",
                    borderLeftColor: kanbanList?.find(
                      (k: any) => k.title.toLowerCase() === task.status?.toLowerCase()
                    )?.color || "#5fd788",
                  }}
                >
                  <Link
                    href={`/task/${task.code}`}
                    className="flex justify-between items-center gap-2 flex-wrap max-w-full p-2"
                  >
                    <span className="text-[#333] font-medium truncate max-w-[60%]">
                      {task.title}
                    </span>

                    <div className="flex items-center gap-3 flex-wrap shrink-0">
                      {task.assigned_to?.firstName && task.assigned_to?.lastName && (
                        <span className="text-sm text-gray-700 truncate max-w-[100px]">
                          {task.assigned_to.firstName} {task.assigned_to.lastName}
                        </span>
                      )}

                      {task.priority && (
                        <span className="text-sm text-gray-700 truncate max-w-[60px]">
                          {task.priority}
                        </span>
                      )}

                      {task.due_date && (
                        <span className="text-sm text-gray-700 truncate max-w-[80px]">
                          {formatDate(task.due_date)}
                        </span>
                      )}

                      <LuEye size={18} className="text-gray-500" />
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
