"use client";

import { ITaskActivityLog } from "@/types/taskactivitylog.interface";

interface TaskActivityLogListProps {
  logs: ITaskActivityLog[];
}

export default function TaskActivityLogList({ logs }: TaskActivityLogListProps) {
  if (!logs.length) {
    return <div className="text-gray-500 text-center">No activity logs available.</div>;
  }

  return (
    <ul className="mt-6">
      {logs.map((log) => (
        <li
          key={log._id}
          className="bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[#333] font-medium">
              {log.description}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
