"use client";

import { useEffect, useState } from "react";
import ReminderService from "@/service/reminder.service";
import ReminderList from "@/components/Reminder/ReminderList";
import { H3 } from "@/components/Heading/H3";
import { P } from "@/components/ptag";
import { IReminder } from "@/types/reminder.interface";

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
      <H3 className="mb-4">My Reminders</H3>

      {loading ? (
        <P>Loading reminders...</P>
      ) : (
        <ReminderList reminders={reminders} />
      )}
    </div>
  );
}
