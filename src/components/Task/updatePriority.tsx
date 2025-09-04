import { RootState } from "@/store/store";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal";
import { useSelector } from "react-redux";
import { useState } from "react";
import { PriorityIcon } from "../icons";
const priorityOption: any = [
    { title: "low", color: "rgb(220, 24, 214)" },
    { title: "medium", color: "rgb(0, 153, 255)" },
    { title: "high", color: "rgb(209, 0, 0)" },
];


interface UpdatePriorityProps {
    task?: any;
    taskId?: any;
    onTaskUpdate?: any
}
export const UpdatePriority = ({ task, taskId, onTaskUpdate }: UpdatePriorityProps) => {

    const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
    const user: any = useSelector((state: RootState) => state.auth.user);
    const priortiyactiveColor = localStorage.getItem("priortiyactiveColor");
    return (

        <li className="mt-[15px]">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 w-[35%]">
                    <PriorityIcon />
                    <span className="text-[#31394f] text-[14px] leading-[16px]">
                        Priority
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            user?.role === "admin" && setIsPriorityModalOpen(true)
                        }
                        className="bg-theme-primary text-white text-[12px] px-[9px] py-[4px] rounded-[8px] font-500"
                        style={{
                            backgroundColor: priortiyactiveColor
                                ? priortiyactiveColor
                                : "rgb(220, 24, 214) ",
                        }}
                    >
                        {task?.priority?.toUpperCase()}
                    </button>
                    <TaskPropertyUpdateModal
                        title="Update Task Priority"
                        options={priorityOption}
                        currentValue={task?.priority}
                        isOpen={isPriorityModalOpen}
                        onClose={() => setIsPriorityModalOpen(false)}
                        taskId={taskId}
                        fieldName="priority"
                        onUpdate={onTaskUpdate}
                        isPriority={true}
                    />
                </div>
            </div>
        </li>
    )
}