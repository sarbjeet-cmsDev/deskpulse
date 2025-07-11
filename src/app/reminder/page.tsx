"use client";

import { useEffect, useState } from "react";
import ReminderService from "@/service/reminder.service";
import ReminderList from "@/components/Reminder/ReminderList";
import { H3 } from "@/components/Heading/H3";
import { P } from "@/components/ptag";
import { IReminder } from "@/types/reminder.interface";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import Link from "next/link";

export default function MyRemindersPage() {
  const [reminders, setReminders] = useState<IReminder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const res = await ReminderService.getAllReminders();
        setReminders(res.reminders);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href="/">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">My Reminders</H3>
      </div>

      {loading ? (
        <P>Loading reminders...</P>
      ) : (
        <ReminderList reminders={reminders} />
      )}
    </div>
  );
}
