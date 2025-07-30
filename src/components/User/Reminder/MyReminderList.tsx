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
import Pagination from "@/components/Pagination/pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function MyReminderList() {
  const [reminders, setReminders] = useState<IReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 5;
  const user: any = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const res = await ReminderService.getReminderByUserId(
          user?.id,
          currentPage,
          itemsPerPage
        );

        const { reminders, total } = res;
        setReminders(reminders);
        setTotalItems(total);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
          <Link href="/">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        <H3 className="text-center flex-1 text-base sm:text-lg md:text-xl">My Reminders</H3>
      </div>

      {loading ? (
        <P>Loading reminders...</P>
      ) : (
        <ReminderList reminders={reminders} />
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}