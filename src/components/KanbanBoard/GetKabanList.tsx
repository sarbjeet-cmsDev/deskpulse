"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import TaskService from "@/service/task.service";
import { KanbanColumn } from "@/types/projectKanbon.interface";
import { Task } from "@/types/task.interface";
import { Button } from "@heroui/button";
import SubTasks from "../ProjectDetails/SubTaskList";
import AdminUserService from "@/service/adminUser.service";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import AvatarList from "../IndexPage/avatarlist";
import ProjectService from "@/service/project.service";

export const GetKanbonList = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [kanbanList, setKanbanList] = useState<KanbanColumn[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [taskView, setTaskView] = useState<"kanban" | "list">("kanban");
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [scrollDirection, setScrollDirection] = useState<"left" | "right" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);

  const fetchKanbonList = async (userIds: string[]) => {
    try {
      const res = await ProjectKanbon.getProjectKanbonList(projectId);
      let taskRes;

      if (userIds.length > 0) {
        taskRes = await TaskService.getTasksByUserIds(projectId, userIds.join(","));
      } else {
        taskRes = await TaskService.getTasksByProject(projectId);
      }

      if (res?.data) setKanbanList(res.data);

      const tasks = taskRes?.data || taskRes?.tasks;
      if (tasks) setTaskList(tasks);

      setError(null);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      setError("Failed to load tasks. Showing last known data.");
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("hiit")
      const data: any = await AdminUserService.getAllUsers();
      console.log(data,"data of all project")
      const result = await ProjectService.getProjectById(projectId);
      console.log(result,"result")
      const userIds = new Set(result?.users || []);
      const matchingUsers = data.data.filter((user: any) => userIds.has(user._id));
      if (matchingUsers.length > 0) setUsers(matchingUsers);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchKanbonList([]);
    fetchUsers();

    const savedView = localStorage.getItem("taskView");
    if (savedView === "list" || savedView === "kanban") {
      setTaskView(savedView);
    }
  }, []);

  useEffect(() => {
    fetchKanbonList(selectedUserIds);
  }, [selectedUserIds]);

  // Auto-scroll while dragging near edges
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !scrollDirection) return;

    const speed = 10;
    const smoothScroll = () => {
      if (!container) return;
      if (scrollDirection === "left") container.scrollLeft -= speed;
      else if (scrollDirection === "right") container.scrollLeft += speed;
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

    if (mouseX - left < edgeThreshold) setScrollDirection("left");
    else if (right - mouseX < edgeThreshold) setScrollDirection("right");
    else setScrollDirection(null);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  // Drop on column = move to another status
  const handleColumnDrop = async (columnTitle: string) => {
    setScrollDirection(null);
    if (!draggedTask || draggedTask.status === columnTitle) return;

    try {
      await TaskService.updateTaskStatus(draggedTask._id, { status: columnTitle });
      setTaskList((prev) =>
        prev.map((t) =>
          t._id === draggedTask._id ? { ...t, status: columnTitle } : t
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
    } finally {
      setDraggedTask(null);
    }
  };

  // Drop on card = reorder inside same column
  const handleCardDrop = async (e: React.DragEvent, columnTitle: string, targetTaskId: string) => {
    e.stopPropagation(); // prevent column drop

    if (!draggedTask || draggedTask._id === targetTaskId || draggedTask.status !== columnTitle) {
      setDraggedTask(null);
      setDragOverTaskId(null);
      return;
    }

    try {
      const ordered = taskList
        .filter((t) => t.status === columnTitle)
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

      const draggedIndex = ordered.findIndex((t) => t._id === draggedTask._id);
      const targetIndex = ordered.findIndex((t) => t._id === targetTaskId);

      // Move dragged before target
      ordered.splice(draggedIndex, 1);
      ordered.splice(targetIndex, 0, draggedTask);

      const updatedData = ordered.map((t, idx) => ({
        _id: t._id,
        sort_order: idx,
      }));

      await TaskService.reorderTasks(projectId, updatedData);

      setTaskList((prev) =>
        prev.map((t) => {
          const updated = updatedData.find((u) => u._id === t._id);
          return updated ? { ...t, sort_order: updated.sort_order } : t;
        })
      );
    } catch (err) {
      console.error("Failed to reorder tasks:", err);
    } finally {
      setDraggedTask(null);
      setDragOverTaskId(null);
    }
  };

  const handleTaskView = (view: "kanban" | "list") => {
    setTaskView(view);
    localStorage.setItem("taskView", view);
  };

 return (
  <div className="mt-[-40px]">
    {error && (
      <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 mx-4 shadow-sm border border-red-300">
        {error}
      </div>
    )}

    {/* Header Section */}
    <div className="flex items-center justify-between md:p-0 p-3">
      {/* View Toggle Buttons */}
      <div className="flex gap-3 p-3 mt-2 bg-white rounded-xl shadow-sm">
        <Button
          variant="bordered"
          className={`rounded-xl px-6 py-2 font-medium transition ${
            taskView === "list"
              ? "bg-blue-600 text-white shadow-md"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onPress={() => handleTaskView("list")}
        >
          List
        </Button>
        <Button
          variant="bordered"
          className={`rounded-xl px-6 py-2 font-medium transition ${
            taskView === "kanban"
              ? "bg-blue-600 text-white shadow-md"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          onPress={() => handleTaskView("kanban")}
        >
          Kanban
        </Button>
      </div>
    </div>

    {taskView === "kanban" ? (
      <div
        ref={scrollContainerRef}
        onDragOver={handleDragOver}
        className="flex w-full gap-4 overflow-x-auto p-2 h-[calc(100vh-190px)] bg-gray-100"
      >
        {kanbanList.map((column) => {
          const matchingCards = taskList
            .filter((card) => card.status === column.title)
            .sort((a: any, b: any) => (b.sort_order ?? 0) - (a.sort_order ?? 0));

          return (
            <div
              key={column._id}
              className="flex flex-col bg-white shadow-md rounded-lg w-80 min-w-[20rem] p-4 !h-[calc(100vh-225px)] overflow-y-auto"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleColumnDrop(column.title)}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {column.title}
              </h3>

              <div className="flex flex-col gap-3">
                {matchingCards.map((card: any) => (
                  <div
                    key={card._id}
                    className={`bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm hover:bg-gray-100 cursor-pointer transition ${
                      dragOverTaskId === card._id ? "ring-2 ring-blue-400" : ""
                    }`}
                    draggable
                    onClick={() => router.push(`/task/${card.code}`)}
                    onDragStart={() => handleDragStart(card)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverTaskId(card._id);
                    }}
                    onDragLeave={() => setDragOverTaskId(null)}
                    onDrop={(e) => handleCardDrop(e, column.title, card._id)}
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
      </div> // ✅ This closes the scrollable kanban container
    ) : (
      <div className="container mx-auto max-w-3xl md:p-0 p-3">
        <SubTasks tasks={taskList} kanbanList={kanbanList} />
      </div>
    )}
  </div>
);
}