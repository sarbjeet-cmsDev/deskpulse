import { useState } from "react";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal"
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { CopyIcon } from "../icons";



interface ClientAcceptanceProps {
    task?: any;
    taskId?: any;
    onTaskUpdate?: any
}


export const ClientAcceptance = ({ task, taskId, onTaskUpdate }: ClientAcceptanceProps) => {

    const [isClientAcceptanceModalOpen, setIsClientAcceptanceModalOpen] =
        useState(false);
    const ClientAcceptanceColor = localStorage.getItem("isCientAcceptanceColor")
    const user: any = useSelector((state: RootState) => state.auth.user);
    const ClientAcceptance: any = [
        { title: "pending", color: "rgb(220, 24, 214)" },
        { title: "Average", color: "rgb(236, 236, 80)" },
        { title: "Good", color: "rgb(0, 128, 0)" },
        { title: "Satisfied", color: "rgb(0, 153, 255)" },
        { title: "Very Satisfied", color: "rgb(255, 165, 0)" },
        { title: "Excellent", color: "rgb(0, 200, 0)" },
    ];
    return (
        <li className="mt-[15px]">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 w-[35%]">
                    <CopyIcon />

                    <span className="text-[#31394f] text-[14px] leading-[16px]">
                        Client Acceptance
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            user?.role === "admin" && setIsClientAcceptanceModalOpen(true)
                        }
                        title={task?.client_acceptance}
                        className="bg-theme-primary text-white text-[12px] px-[9px] py-[4px] rounded-[8px] font-500"
                        style={{ backgroundColor: ClientAcceptanceColor ? ClientAcceptanceColor : "rgb(220, 24, 214) " }}
                    >
                        {task?.client_acceptance?.toUpperCase()}
                    </button>
                    <TaskPropertyUpdateModal
                        title="Update Client Acceptance"
                        options={ClientAcceptance}
                        currentValue={task?.client_acceptance}
                        isOpen={isClientAcceptanceModalOpen}
                        onClose={() => setIsClientAcceptanceModalOpen(false)}
                        taskId={taskId}
                        fieldName="client_acceptance"
                        onUpdate={onTaskUpdate}
                        isCientAcceptance={true}
                    />
                </div>
            </div>
        </li >
    )
}