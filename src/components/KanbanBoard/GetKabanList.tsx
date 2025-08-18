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
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number | null>(null);

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

      if (res?.data) {
        setKanbanList(res.data);
      }

      const tasks = taskRes?.data || taskRes?.tasks;
      if (tasks) {
        setTaskList(tasks);
      }

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

  const handleDrop = async (columnTitle: string) => {
    setScrollDirection(null);
    if (!draggedTask || draggedTask.status === columnTitle) return;

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

  const handleTaskView = (view: "kanban" | "list") => {
    setTaskView(view);
    localStorage.setItem("taskView", view);
  };

  return (
    <div className="mt-[-40px]">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 mx-4">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between md:p-0 p-2">
        <div className="flex flex-start gap-5 p-5">
          <Button
            variant="bordered"
            className={`border-none ${taskView === "list" ? "bg-blue-500 text-white" : ""}`}
            onPress={() => handleTaskView("list")}
          >
            List
          </Button>
          <Button
            variant="bordered"
            className={`border-none ${taskView === "kanban" ? "bg-blue-500 text-white" : ""}`}
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
                  {matchingCards.map((card: any) => (
                    // <div
                    //   key={card._id}
                    //   className="bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm hover:bg-gray-100 cursor-pointer transition"
                    //   draggable
                    //   onClick={() => router.push(`/task/${card._id}`)}
                    //   onDragStart={() => handleDragStart(card)}
                    // >
                    //   <p className="text-sm font-medium text-gray-700">
                    //     {card.title}
                    //     {/* {card.assigned_to} */}
                    //   </p>
                    // </div>

                    <div
                      key={card._id}
                      className={`bg-gray-50 border border-gray-200 rounded-md p-3 shadow-sm hover:bg-gray-100 cursor-pointer transition ${dragOverTaskId === card._id
                        ? "ring-2 ring-blue-400"
                        : ""
                        }`}
                      draggable
                      onClick={() => router.push(`/task/${card.code}`)}
                      onDragStart={() => handleDragStart(card)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverTaskId(card._id);
                      }}
                      onDrop={async () => {
                        if (
                          draggedTask &&
                          dragOverTaskId &&
                          draggedTask._id !== dragOverTaskId &&
                          draggedTask.status === column.title
                        ) {
                          try {
                            await TaskService.reorderTask(draggedTask._id, {
                              targetTaskId: dragOverTaskId,
                              status: column.title,
                            });
                            fetchKanbonList(selectedUserIds);
                          } catch (err) {
                            console.error("Failed to reorder tasks:", err);
                          }
                        }
                        setDraggedTask(null);
                        setDragOverTaskId(null);
                      }}
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
      ) : (
        <div className="container mx-auto max-w-3xl md:p-0 p-3">
          <SubTasks tasks={taskList} kanbanList={kanbanList} />
        </div>
      )}
    </div>
  );
};
