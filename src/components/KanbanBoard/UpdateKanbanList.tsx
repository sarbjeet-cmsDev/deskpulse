"use client";
import { useEffect, useState } from "react";
import { Input } from "../Form/Input";
import { Button } from "../Form/Button";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import { confirmDelete } from "@/utils/confirmDelete";
import { useRouter } from "next/navigation";
import TaskService from "@/service/task.service";
import { H3 } from "../Heading/H3";


import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type KanbanItem = {
  _id: string;
  title: string;
  sort_order: number;
};
type UpdateKanbanListProps = {
  projectId: any;
  project: any;
};


const SortableKanbanItem = ({
  item,
  children,
}: {
  item: KanbanItem;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export const UpdateKanbanList = ({
  projectId,
  project,
}: UpdateKanbanListProps) => {
  const [kanbanList, setKanbanList] = useState<KanbanItem[]>([]);
  const [editedTitles, setEditedTitles] = useState<{ [id: string]: string }>({});
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [id: string]: string }>({});
  const [task, setTask] = useState<any[]>([]);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  }));

  useEffect(() => {
    const fetchKanbanList = async () => {
      try {
        const res = await ProjectKanbon.getProjectKanbonList(projectId);
        const sortedKanbans = res.data.sort(
          (a: KanbanItem, b: KanbanItem) => a.sort_order - b.sort_order
        );
        setKanbanList(sortedKanbans);
        const titleMap = Object.fromEntries(
          sortedKanbans.map((item: KanbanItem) => [item._id, item.title])
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

  const handleDragEnd = async ({ active, over }: any) => {
    if (!over || active.id === over.id) return;

    const oldIndex = kanbanList.findIndex((item) => item._id === active.id);
    const newIndex = kanbanList.findIndex((item) => item._id === over.id);

    const reordered = arrayMove(kanbanList, oldIndex, newIndex);
    setKanbanList(reordered);

    const payload = {
      data: reordered.map((item, i) => ({
        _id: item._id,
        sort_order: i
      }))
    };

    try {
      await ProjectKanbon.updateKanbanSortOrder(payload, projectId);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="container mx-auto max-w-3xl">
      <H3 className="py-6">Edit Kanban Lists for {project?.title}</H3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={kanbanList.map((k) => k._id)}
          strategy={verticalListSortingStrategy}
        >
          {kanbanList.map((item) => (
            <SortableKanbanItem key={item._id} item={item}>
              <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3 py-1 px-3 rounded border ${activeEditId === item._id ? "bg-yellow-100" : "bg-gray-50"}`}>
                <div className="w-full flex-1">
                  <Input
                    value={editedTitles[item._id] || ""}
                    onChange={(e) => { handleTitleChange(item._id, e.target.value); setActiveEditId(item._id); }}
                    onFocus={() => setActiveEditId(item._id)}
                    onBlur={() => setActiveEditId(null)}
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
                    className="btn-primary"
                  >
                    {activeEditId === item._id ? "Update" : "Edit"}
                  </Button>
                  <Button
                    onPress={() => handleDelete(item._id)}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </SortableKanbanItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        onPress={() => router.push("/admin/kanban/create")}
        className="w-full btn-primary text-white font-semibold py-2 px-4 rounded"
      >
        Create New Kanban List
      </Button>
    </div>
  );
};
