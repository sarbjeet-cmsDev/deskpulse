"use client";

import { useState } from "react";
import Link from "next/link";
import ShowMoreLess from "../common/ShowMoreLess/ShowMoreLess";
import AvatarList from "../IndexPage/avatarlist";
import { formatDate } from "@/utils/formatMinutes";

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
    return <div className="text-gray-500 text-left italic mt-2">No tasks available.</div>;
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
                    borderLeftColor:
                      kanbanList?.find(
                        (k: any) =>
                          k.title.toLowerCase() === task.status?.toLowerCase()
                      )?.color || "#5fd788",
                  }}
                >
                  <Link
                    href={`/task/${task.code}`}
                    className="flex justify-between items-center gap-2 flex-wrap max-w-full p-2"
                  >
                    <span className="text-[#333] font-medium truncate max-w-[60%]" title="Task Title">
                      {task.title}
                    </span>

                    <div className="flex flex-col-reverse items-end gap-3 flex-wrap shrink-0 md:flex-row md:items-center ">
                      <>
                        {task.due_date && (
                          <span className="text-sm text-gray-700" title="Due Date">
                            {formatDate(task.due_date)}
                          </span>
                        )}
                      </>
                      <>
                        {task.priority && (
                          <span className="text-sm text-gray-700 truncate max-w-[60px]" title="Priority">
                            {task.priority}
                          </span>
                        )}
                      </>

                      <AvatarList users={[task?.assigned_to]} />
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
