import { useState } from "react";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal";
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
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g opacity="0.9">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.6115 1.66675C16.4357 1.66675 18.3332 3.64841 18.3332 6.59675V13.4034C18.3332 16.3517 16.4357 18.3334 13.6107 18.3334H6.38734C3.56317 18.3334 1.6665 16.3517 1.6665 13.4034V6.59675C1.6665 3.64841 3.56317 1.66675 6.38734 1.66675H13.6115ZM13.6115 2.91675H6.38734C4.279 2.91675 2.9165 4.36091 2.9165 6.59675V13.4034C2.9165 15.6392 4.279 17.0834 6.38734 17.0834H13.6107C15.7198 17.0834 17.0832 15.6392 17.0832 13.4034V6.59675C17.0832 4.36091 15.7198 2.91675 13.6115 2.91675ZM13.4078 7.58091C13.6519 7.82508 13.6519 8.22008 13.4078 8.46425L9.45275 12.4192C9.33109 12.5417 9.17109 12.6026 9.01109 12.6026C8.85192 12.6026 8.69109 12.5417 8.56942 12.4192L6.59109 10.4417C6.34692 10.1976 6.34692 9.80258 6.59109 9.55841C6.83525 9.31425 7.23025 9.31425 7.47442 9.55841L9.01109 11.0934L12.5244 7.58091C12.7686 7.33675 13.1636 7.33675 13.4078 7.58091Z"
                                fill="#31394F"
                            />
                        </g>
                    </svg>
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