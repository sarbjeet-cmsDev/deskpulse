"use client";

import { H3 } from "@/components/Heading/H3";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import Link from "next/link";
import { P } from "@/components/ptag";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReminderService from "@/service/reminder.service";
import { IReminder } from "@/types/reminder.interface";

export default function ReminderDetailPage() {
  const params = useParams();
  const reminderId = params?.reminderId as string;
  const [reminder, setReminder] = useState<IReminder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async (id: string) => {
      try {
        const res = await ReminderService.getReminderById(id);
        setReminder(res);
      } catch (error) {
        console.error("Failed to fetch reminder:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reminderId) {
      fetchReminders(reminderId);
    }
  }, [reminderId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB") + ", " + date.toLocaleTimeString("en-GB");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading reminder details...</div>;
  }

  if (!reminder) {
    return <div className="p-6 text-center text-red-500">Reminder not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-center items-center gap-4 border-b pb-4 mb-6">
        <div className="w-[2%]">
        <Link href="/">
          <Image src={leftarrow} alt="Back" width={24} height={24} />
        </Link>
        </div>
        <H3 className="w-[98%] text-xl text-center font-semibold">Reminder Details</H3>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-3 border border-gray-200">
        <DetailItem label="Title" value={reminder.title} />
        <DetailItem label="Start Time" value={formatDate(reminder.start)} />
        <DetailItem label="End Time" value={formatDate(reminder.end)} />
        <DetailItem label="Alert Enabled" value={reminder.alert ? "Yes" : "No"} />
        <DetailItem label="Alert Before" value={`${reminder.alert_before} minute(s)`} />
        <DetailItem label="Created At" value={formatDate(reminder.createdAt)} />
      </div>
    </div>
  );
}


function DetailItem({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string | number | undefined;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between text-sm sm:text-base border-b last:border-none pb-2">
      <P className="text-gray-600 font-medium">{label}:</P>
      <p className={`text-right font-medium ${valueClass}`}>{value ?? "-"}</p>
    </div>
  );
}
