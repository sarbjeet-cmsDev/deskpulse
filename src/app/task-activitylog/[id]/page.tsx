"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskActivityLogService from "@/service/taskActivityLogService";
import TaskActivityLogList from "@/components/TaskActivityLog/activitylogList";
import { H3 } from "@/components/Heading/H3";
import { P } from "@/components/ptag";
import { ITaskActivityLog } from "@/types/taskactivitylog.interface";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";
import Link from "next/link";
import Pagination from "@/components/Pagination/pagination";

export default function TaskActivityLogPage() {
  const { id: taskId } = useParams();
  const [logs, setLogs] = useState<ITaskActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 5;

  console.log("logs",logs)

  useEffect(() => {
    if (!taskId) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await TaskActivityLogService.getByTaskId(
          taskId as string,
          currentPage,
          itemsPerPage
        );
        console.log("res111111",res)
        setLogs(res.taskactivitylog);
        setTotalItems(res.total);
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [taskId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-center items-center p-[24px] border-b border-[#31394f14]">
        <div className="w-[2%]">
          <Link href={`/task/${taskId}`}>
            <Image src={leftarrow} alt="Back" width={16} height={16} />
          </Link>
        </div>
        <H3 className="w-[98%] text-center">Task Activity Logs</H3>
      </div>

      {loading ? (
        <P>Loading activity logs...</P>
      ) : (
        <TaskActivityLogList logs={logs} />
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
