"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import TaskService from "@/service/task.service";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import { Task } from "@/types/task.interface";

export const GetKanbonList = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [kanbanList, setKanbanList] = useState<KanbanColumn[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);

  const fetchKanbonList = async () => {
    try {
      const res = await ProjectKanbon.getProjectKanbonList(projectId);
      const taskRes = await TaskService.getTasksByProject(projectId);
      setKanbanList(res?.data || []);
      setTaskList(taskRes?.data || []);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setKanbanList([]);
      setTaskList([]);
    }
  };

  useEffect(() => {
    fetchKanbonList();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !scrollDirection) return;

    const speed = 10;

    const smoothScroll = () => {
      if (!container) return;

      if (scrollDirection === "left") {
        container.scrollLeft -= speed;
      } else if (scrollDirection === "right") {
        container.scrollLeft += speed;
      }

      scrollRef.current = requestAnimationFrame(smoothScroll);
    };

    scrollRef.current = requestAnimationFrame(smoothScroll);

    return () => {
      if (scrollRef.current) {
        cancelAnimationFrame(scrollRef.current);
        scrollRef.current = null;
      }
    };
  }, [scrollDirection]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;

    const { left, right } = container.getBoundingClientRect();
    const mouseX = e.clientX;
    const edgeThreshold = 80;

    if (mouseX - left < edgeThreshold) {
      setScrollDirection("left");
    } else if (right - mouseX < edgeThreshold) {
      setScrollDirection("right");
    } else {
      setScrollDirection(null);
    }
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (columnTitle: string) => {
    setScrollDirection(null);
    if (!draggedTask || draggedTask?.status === columnTitle) return;

    try {
      await TaskService.updateTaskStatus(draggedTask._id, {
        status: columnTitle,
      });

      const updatedTasks = taskList.map((t) =>
        t._id === draggedTask._id ? { ...t, status: columnTitle } : t
      );
      setTaskList(updatedTasks);
    } catch (err) {
      console.error("Failed to update task status:", err);
    } finally {
      setDraggedTask(null);
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      onDragOver={handleDragOver}
      className="flex w-full gap-4 overflow-x-auto p-2 h-[calc(100vh-190px)] bg-gray-100"
    >
      {kanbanList.map((column) => {
        const matchingCards = taskList.filter(
          (card) => card.status === column.title
        );

        return (
          <div
            key={column._id}
            className="flex flex-col bg-white shadow-md rounded-lg w-80 min-w-[20rem] p-4 !h-[calc(100vh-225px)] overflow-y-auto"
            onDrop={() => handleDrop(column.title)}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {column.title}
            </h3>

            <div className="flex flex-col gap-3">
              {matchingCards.map((card) => (
                <div
                  key={card._id}
                  className="bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm hover:bg-gray-100 cursor-pointer transition"
                  draggable
                  onClick={() => router.push(`/task/${card._id}`)}
                  onDragStart={() => handleDragStart(card)}
                >
                  <p className="text-sm font-medium text-gray-700">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
