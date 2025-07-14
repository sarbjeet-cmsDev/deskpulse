"use client";

import Link from "next/link";
import Image from "next/image";
import info from "@/assets/images/info.png";
import { IReminder } from "@/types/reminder.interface";

interface ReminderListProps {
  reminders: IReminder[];
}

export default function ReminderList({ reminders }: ReminderListProps) {
  if (!reminders.length) {
    return <div className="text-gray-500">No reminders available.</div>;
  }

  return (
    <ul className="mt-6">
      {reminders.map((reminder) => (
        <li
          key={reminder._id}
          className="bg-[#f8fafc] w-full py-[15px] px-[20px] rounded-[8px] border-l-[8px] border-l-[#5fd788] mt-[16px]"
        >
          <Link href={`#`} className="flex justify-between items-center">
            <span className="text-[#333] font-medium">{reminder.title}</span>
            <Image
              src={info}
              alt="Details"
              width={20}
              height={20}
              className="cursor-pointer opacity-70 hover:opacity-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
