"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskService, { ITask } from "@/service/task.service";
import { H5 } from "@/components/Heading/H5";
import { P } from "@/components/ptag";
import Image from "next/image";
import leftarrow from "@/assets/images/back.png";

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params?.id as string;
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (taskId) {
      TaskService.getTaskById(taskId as string)
        .then((data) => setTask(data))
        .catch((err) => console.error("Failed to load task:", err))
        .finally(() => setLoading(false));
    }
  }, [taskId]);

  if (loading) return <div className="p-6 text-center">Loading task...</div>;
  if (!task) return <div className="p-6 text-center">Task not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        <a href="/project/list">
          <Image src={leftarrow} alt="Back" width={16} height={16} />
        </a>
        <H5>Task Details</H5>
      </div>

      <div className="border rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-2">{task.title}</h3>
        {/* <P><strong>Priority:</strong> {task.priority}</P>
        <P><strong>Status:</strong> {task.is_active ? "Active" : "Inactive"}</P>
        <P><strong>Project ID:</strong> {task.project}</P>
        <P><strong>Report To:</strong> {task.report_to}</P> */}
        <P><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</P>
        <P><strong>Updated At:</strong> {new Date(task.updatedAt).toLocaleString()}</P>
      </div>
    </div>
  );
}
