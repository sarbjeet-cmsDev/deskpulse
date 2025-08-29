"use client";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectRoutes/ProtectedRoute";
import TopHeader from "@/components/IndexPage/TopHeader";
import { Link } from "@heroui/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TaskButton from "@/components/taskButton";
import CreateGlobalTaskModal from "@/components/CreateGlobalTaskModal";
import { useState, useEffect, useRef } from "react";
import ReminderService from "@/service/reminder.service";
import { checkReminders } from "@/utils/reminderNotification";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userData: any = useSelector((state: RootState) => state.auth.user);
  const hideLayout = pathname.startsWith("/auth/login");

  const remindersRef = useRef<any[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userData?.id) return;
    async function fetchReminders() {
      try {
        const res: any = await ReminderService.getReminderByUserId(userData?.id);
        remindersRef.current = res?.reminders?.map((r: any) => ({ ...r, triggered: false }));
      } catch (err) {
        console.error("❌ Failed to fetch reminders", err);
      }
    }
    fetchReminders();
    const pollInterval = setInterval(fetchReminders, 10 * 60 * 1000);
    return () => clearInterval(pollInterval);
  }, [userData]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders(remindersRef);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (hideLayout) {
    return <main>{children}</main>;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen text-sm md:text-base">
        <div className="sticky top-0 z-[998]">
          <TopHeader />
        </div>
        <main className="pt-6 md:px-4 md:px-8 lg:px-10 flex-grow mb-10">{children}</main>
        <footer className="w-full flex items-center justify-center py-4 bg-theme-primary text-white text-xs sm:text-sm">
          <Link className="flex items-center gap-1 text-current" href="#" title="bronzebyte">
            <p className="text-white">© {new Date().getFullYear()} copyright all rights reserved</p>
          </Link>
        </footer>
        <TaskButton onClick={openModal} />
        {isModalOpen && (
          <CreateGlobalTaskModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onCreate={async (
              title,
              description,
              due_date,
              estimated_time,
              assigned_to,
              projectId
            ) => {
              // API call
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
