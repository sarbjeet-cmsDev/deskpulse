'use client';

import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import { H3 } from "@/components/Heading/H3";
import Pagination from "@/components/Pagination/pagination"; 
import { useEffect, useState } from "react";
import TaskService, { ITask } from "@/service/task.service";
import SubTasks from "@/components/ProjectDetails/SubTaskList";
import Link from "next/link";

export default function MyTask() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 5; 
  const fetchTasks = async (page: number) => {
    setLoading(true);
    try {
      const res = await TaskService.getMyTasks(page, itemsPerPage);
      setTasks(res?.data || []);
      setTotalItems(res?.total || 0);  
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href="/">
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">My Task</H3>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center">No tasks found.</p>
        ) : (
          <>
            <SubTasks tasks={tasks} />

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
