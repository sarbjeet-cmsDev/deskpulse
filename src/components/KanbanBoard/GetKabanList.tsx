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
import AvatarList from "../IndexPage/avatarlist";
import ProjectService from "@/service/project.service";
import { formatDate } from "@/utils/formatMinutes";
import { FaCalendarAlt, FaFlag, FaUser } from "react-icons/fa";

export const GetKanbonList = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.project as string;

  const [kanbanList, setKanbanList] = useState<KanbanColumn[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [taskView, setTaskView] = useState<"kanban" | "list">("kanban");
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);
  console.log(taskList, "taskListtaskList");
  const fetchKanbonList = async (userIds: string[]) => {
    try {
      const res = await ProjectKanbon.getProjectKanbonList(projectId);
      let taskRes;

      if (userIds.length > 0) {
        taskRes = await TaskService.getTasksByUserIds(
          projectId,
          userIds.join(",")
        );
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
      const data: any = await AdminUserService.getAllUsers();

      const result = await ProjectService.getProjectById(projectId);

      const userIds = new Set(result?.users || []);
      const matchingUsers = data.data.filter((user: any) =>
        userIds.has(user._id)
      );
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

  const handleColumnDrop = async (columnTitle: string) => {
    setScrollDirection(null);
    if (!draggedTask || draggedTask.status === columnTitle) return;

    try {
      await TaskService.updateTaskStatus(draggedTask._id, {
        status: columnTitle,
      });
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

  const handleCardDrop = async (
    e: React.DragEvent,
    columnTitle: string,
    targetTaskId: string
  ) => {
    e.stopPropagation();

    if (
      !draggedTask ||
      draggedTask._id === targetTaskId
    ) {
      setDraggedTask(null);
      setDragOverTaskId(null);
      return;
    }

    try {
      if (draggedTask.status !== columnTitle) {
        await TaskService.updateTaskStatus(draggedTask._id, {
          status: columnTitle,
        });

        setTaskList((prev) =>
          prev.map((t) =>
            t._id === draggedTask._id ? { ...t, status: columnTitle } : t
          )
        );
      } else {
        const ordered = taskList
          .filter((t) => t.status === columnTitle)
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        const draggedIndex = ordered.findIndex(
          (t) => t._id === draggedTask._id
        );
        const targetIndex = ordered.findIndex((t) => t._id === targetTaskId);
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
      }
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

      <div className="flex items-center justify-between md:p-0 p-3">
        <div className="flex gap-3 p-3 mt-2 bg-white rounded-xl shadow-sm">
          <Button
            variant="bordered"
            className={`rounded-xl px-6 py-2 font-medium transition ${
              taskView === "list"
                ? "bg-theme-primary text-white shadow-md"
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
                ? "bg-theme-primary text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onPress={() => handleTaskView("kanban")}
          >
            Kanban
          </Button>
        </div>
        <AvatarList
          users={users}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
          fetchKanbonList={fetchKanbonList}
        />
      </div>

      {taskView === "kanban" ? (
        <div
          ref={scrollContainerRef}
          onDragOver={handleDragOver}
          className="flex w-full gap-5 overflow-x-auto p-4 h-[calc(100vh-190px)] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
        >
          {kanbanList.map((column: any) => {
            const matchingCards = taskList
              .filter((card) => card.status === column.title)
              .sort(
                (a: any, b: any) => (b.sort_order ?? 0) - (a.sort_order ?? 0)
              );

            return (
              <div
                key={column._id}
                className="flex flex-col bg-white shadow-lg rounded-2xl w-80 min-w-[20rem] p-5 !h-[calc(100vh-225px)] overflow-y-auto border border-gray-200 hover:shadow-xl transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleColumnDrop(column.title)}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span
                    className={`w-3  h-3 rounded-full`}
                    style={{
                      backgroundColor: column.color
                        ? column.color
                        : "rgb(59 130 246)",
                    }}
                  ></span>
                  {column.title}
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {matchingCards.length}
                  </span>
                </h3>

                <div className="flex flex-col gap-3">
                  {matchingCards.map((card: any) => (
                    <div
                      key={card._id}
                      className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-pointer transition 
              hover:bg-blue-50 hover:shadow-md 
              ${dragOverTaskId === card._id ? "ring-2 ring-blue-400" : ""}`}
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
                      <p className="text-base font-semibold text-gray-800 mb-4">
                        {card.title}
                      </p>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-green-500" />
                          <span className="font-medium">Assigned To:</span>
                          <span>
                            {card?.assigned_to?.username || "Unassigned"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-500" />
                          <span className="font-medium">Due Date:</span>
                          <span>{formatDate(card?.due_date)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaFlag className="text-red-500" />
                          <span className="font-medium">Priority:</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium
          ${
            card?.priority?.toLowerCase() === "high"
              ? "bg-red-100 text-red-700"
              : card?.priority?.toLowerCase() === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : card?.priority?.toLowerCase() === "low"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
          }`}
                          >
                            {card?.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="container mx-auto max-w-3xl md:p-0 p-3">
          <SubTasks tasks={taskList} kanbanList={kanbanList} />
        </div>
      )}
    </div>
  );
};
