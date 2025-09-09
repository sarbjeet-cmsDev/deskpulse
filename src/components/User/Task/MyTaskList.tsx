"use client";

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import { useEffect, useState } from "react";
import TaskService, { ITask } from "@/service/task.service";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import { useRouter } from "next/navigation";


export default function MyTaskList() {
  const router = useRouter();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchTasks = async (page: number) => {
    setLoading(true);
    try {
      const res = await TaskService.getMyTasks();
      setTasks(res?.data || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center md:p-[24px] p-2 border-b border-[#31394f14]">
        <div className="w-10 cursor-pointer" onClick={() => router.back()}>
          <Image src={leftarrow} alt="Back" width={16} height={16} />
        </div>
        <H3 className="w-[98%] text-center">My Task</H3>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-left italic text-gray-500">No tasks found.</p>
        ) : (
          <>
            <SubTasks tasks={tasks} />
          </>
        )}
      </div>

    </div>
  );
}
