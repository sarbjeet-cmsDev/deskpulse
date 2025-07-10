import { useEffect, useState } from "react";
import { ITaskChecklist } from "@/types/taskchecklist.interface";
import DropdownOptions from "../DropdownOptions";
import TaskChecklistService from "@/service/taskChecklist.service";
import { confirmDelete } from "@/utils/confirmDelete";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SubTasksProps {
  taskchecklist: ITaskChecklist[];
  refreshList?: () => void;
}

export default function TaskChecklist({ taskchecklist, refreshList }: SubTasksProps) {
  const [checklists, setChecklists] = useState<ITaskChecklist[]>(taskchecklist);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    setChecklists(taskchecklist);
  }, [taskchecklist]);

  const handleDelete = async (checklistId: string) => {
    const confirmed = await confirmDelete("checklist");
    if (!confirmed) return;

    try {
      await TaskChecklistService.deleteChecklist(checklistId);
      setChecklists((prev) => prev.filter((item) => item._id !== checklistId));
      if (refreshList) refreshList();
    } catch (error) {
      console.error("Failed to delete checklist:", error);
    }
  };

  const handleStatusChange = async (checklist: ITaskChecklist, checked: boolean) => {
     const updatedStatus: 'complete' | 'pending' = checked ? 'complete' : 'pending';
  
    const payload = {
      status: updatedStatus,
      completed_by: checked ? user?.id : undefined,
    };

    try {
      const res = await TaskChecklistService.updateChecklist(checklist._id, payload);
      setChecklists((prev) =>
        prev.map((item) => (item._id === checklist._id ? res.checklist : item))
      );
    } catch (error) {
      console.error("Failed to update checklist:", error);
    }
  };

  const completedCount = checklists.filter((item) => item.status === "complete").length;
  const progress = checklists.length ? Math.round((completedCount / checklists.length) * 100) : 0;

  return (
    <div>

      <div className="mt-2 mb-4 flex items-center gap-4">
        <span className="text-sm text-gray-500 min-w-[30px]">{progress}%</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-2">
        {checklists.map((checklist) => (
          <li
            key={checklist._id}
            className="inactive bg-[#f8fafc] w-full py-[10px] px-[15px] rounded-[8px] border-l-[6px] border-l-[#5fd788] mt-[10px]"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checklist.status === "complete"}
                  onChange={(e) => handleStatusChange(checklist, e.target.checked)}
                  className="accent-green-500"
                />
                <span className={checklist.status === "complete" ? "line-through text-gray-500" : ""}>
                  {checklist.title}
                </span>
              </div>
              <DropdownOptions
                options={[
                  {
                    key: "delete",
                    label: "Delete",
                    color: "danger",
                    onClick: () => handleDelete(checklist._id),
                  },
                ]}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
