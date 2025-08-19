"use client";

import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png";
import { IReminder } from "@/types/reminder.interface";

interface ReminderListProps {
  reminders: IReminder[];
}

export default function ReminderList({ reminders }: ReminderListProps) {
  if (!reminders?.length) {
    return <div className="text-gray-500 text-center">No reminders available.</div>;
  }

  return (
    <ul className="mt-6 md:p-0 p-2">
      {reminders.map((reminder) => {
        const formattedStart = reminder?.start
          ? new Date(reminder.start).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })
          : null;

        return (
          <li
            key={reminder._id}
            className="bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]"
          >
            <Link
              href={`/reminder/detail/${reminder._id}`}
              className="flex justify-between items-center gap-2"
            >
              <span className="text-[#333] font-medium truncate">
                {reminder.title || "Untitled Reminder"}
              </span>
              <div className="flex items-center gap-2">
                {formattedStart && (
                  <div className="flex items-center text-sm text-gray-500 gap-1 whitespace-nowrap">
                    <span>🕒</span>
                    <span>{formattedStart}</span>
                  </div>
                )}

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
        );
      })}
    </ul>
  );
}
