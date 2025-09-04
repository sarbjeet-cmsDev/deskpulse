import { useState } from "react";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal";
import { TaskTypeIcon } from "../icons";
export enum TaskTypeEnum {
    UI_UX = "ui/ux",
    BACKEND = "backend",
    UI_UX_BUG = "ui/ux bug",
    BACKEND_BUG = "backend bug",
    DEVOPS = "DevOps",
    QA = "QA",
    RND = "R&D",
}

interface UpdateTypeProps {
    task?: any;
    taskId?: any;
    onTaskUpdate?: any
}
export const UpdateType = ({ task, taskId, onTaskUpdate }: UpdateTypeProps) => {

    const [isTaskTypeModalOpen, setIsTaskTypeModalOpen] = useState(false);

    return (
        <li className="mt-[10px]">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 w-[35%]">
                    <TaskTypeIcon />
                    <span className="text-[#31394f] text-[14px] leading-[16px]">
                        Task Type
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsTaskTypeModalOpen(true)}
                        className="bg-theme-primary text-white text-[12px] px-[9px] py-[4px] rounded-[8px] font-500"
                    >
                        {task?.type?.toUpperCase()}
                    </button>
                    <TaskPropertyUpdateModal
                        title="Update Task Type"
                        options={Object.values(TaskTypeEnum)}
                        currentValue={task?.type}
                        isOpen={isTaskTypeModalOpen}
                        onClose={() => setIsTaskTypeModalOpen(false)}
                        taskId={taskId}
                        fieldName="type"
                        onUpdate={onTaskUpdate}
                    />
                </div>
            </div>
        </li>
    )
}