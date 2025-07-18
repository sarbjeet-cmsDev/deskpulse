"use client";
import { useEffect, useState } from "react";
import { Input } from "../Form/Input";
import { Button } from "../Form/Button";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import { confirmDelete } from "@/utils/confirmDelete";
import { useRouter } from "next/navigation";
import TaskService from "@/service/task.service";
import { H3 } from "../Heading/H3";

type KanbanItem = {
  _id: string;
  title: string;
};
type UpdateKanbanListProps = {
  projectId: any;
  project: any;
};
export const UpdateKanbanList = ({
  projectId,
  project,
}: UpdateKanbanListProps) => {
  const [kanbanList, setKanbanList] = useState<KanbanItem[]>([]);
  const [editedTitles, setEditedTitles] = useState<{ [id: string]: string }>(
    {}
  );
  const [errors, setErrors] = useState<{ [id: string]: string }>({});
  const [task, setTask] = useState<any>([]);
  useEffect(() => {
    const fetchKanbanList = async () => {
      try {
        const res = await ProjectKanbon.getProjectKanbonList(projectId);
        setKanbanList(res.data);
        const titleMap = Object.fromEntries(
          res.data.map((item: KanbanItem) => [item._id, item.title])
        );
        setEditedTitles(titleMap);
        const taskRes = await TaskService.getTasksByProject(projectId);
        setTask(taskRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchKanbanList();
  }, []);

  const handleTitleChange = (id: string, value: string) => {
    setEditedTitles((prev) => ({ ...prev, [id]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleEdit = async (id: string) => {
    const newTitle = editedTitles[id]?.trim();

    if (!newTitle) {
      setErrors((prev) => ({ ...prev, [id]: "Title is required" }));
      return;
    }

    try {
      await ProjectKanbon.updateKanbanList({ title: newTitle }, id);
      setKanbanList((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, title: newTitle } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete("Kanban List");
    if (!confirmed) return;

    try {
      const deletingKanban = kanbanList.find((item) => item._id === id);
      if (!deletingKanban) return;
      const matchingTasks = task.filter(
        (t: any) => t.status === deletingKanban.title
      );
      await Promise.all(
        matchingTasks.map((t: any) =>
          TaskService.updateTask(t._id, { status: "backlog" })
        )
      );
      await ProjectKanbon.deleteKanbanList(id);
      setKanbanList((prev) => prev.filter((item) => item._id !== id));
      setTask((prev: any[]) =>
        prev.map((t) =>
          matchingTasks.find((mt: any) => mt._id === t._id)
            ? { ...t, status: "Backlog" }
            : t
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();
  return (
    <div className="container mx-auto max-w-3xl">
      <H3 className="py-6">Edit Kanban Lists for {project?.title}</H3>

      {kanbanList.map((item) => (
        <div
          key={item._id}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3 py-1 rounded"
        >
          <div className="w-full flex-1">
            <Input
              value={editedTitles[item._id] || ""}
              onChange={(e) => handleTitleChange(item._id, e.target.value)}
              className="w-full"
              placeholder="Enter title"
            />
            {errors[item._id] && (
              <p className="text-red-500 text-sm mt-1">{errors[item._id]}</p>
            )}
          </div>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              onPress={() => handleEdit(item._id)}
              className="text-blue-600"
            >
              Edit
            </Button>
            <Button
              onPress={() => handleDelete(item._id)}
              className="text-red-600"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
      <Button
        onPress={() => router.push("/admin/kanban/create")}
        className="w-full btn-primary text-white font-semibold py-2 px-4 rounded"
      >
        Create New Kanban List
      </Button>
    </div>
  );
};
