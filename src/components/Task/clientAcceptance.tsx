import { useState } from "react";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal"
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";



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
        { title: "Average", color: "rgb(225, 249, 47)" },
        { title: "Good", color: "rgb(0, 128, 0)" },
        { title: "Satisfied", color: "rgb(0, 153, 255)" },
        { title: "Very Satisfied", color: "rgb(255, 165, 0)" },
        { title: "Excellent", color: "rgb(0, 200, 0)" },
    ];
    return (
        <li className="mt-[15px]">
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
                                d="M13.257 1.66675C15.877 1.66675 17.637 3.46091 17.637 6.13091V13.7942C17.637 16.4876 15.9312 18.2392 13.2912 18.2559L6.88034 18.2584C4.26034 18.2584 2.49951 16.4642 2.49951 13.7942V6.13091C2.49951 3.43675 4.20535 1.68591 6.84535 1.67008L13.2562 1.66675H13.257ZM13.257 2.91675L6.84951 2.92008C4.90951 2.93175 3.74951 4.13175 3.74951 6.13091V13.7942C3.74951 15.8067 4.92035 17.0084 6.87951 17.0084L13.287 17.0059C15.227 16.9942 16.387 15.7926 16.387 13.7942V6.13091C16.387 4.11841 15.217 2.91675 13.257 2.91675ZM13.0963 12.8948C13.4413 12.8948 13.7213 13.1748 13.7213 13.5198C13.7213 13.8648 13.4413 14.1448 13.0963 14.1448H7.0796C6.73459 14.1448 6.45459 13.8648 6.45459 13.5198C6.45459 13.1748 6.73459 12.8948 7.0796 12.8948H13.0963ZM13.0963 9.40608C13.4413 9.40608 13.7213 9.68608 13.7213 10.0311C13.7213 10.3761 13.4413 10.6561 13.0963 10.6561H7.0796C6.73459 10.6561 6.45459 10.3761 6.45459 10.0311C6.45459 9.68608 6.73459 9.40608 7.0796 9.40608H13.0963ZM9.37518 5.92542C9.72018 5.92542 10.0002 6.20542 10.0002 6.55042C10.0002 6.89542 9.72018 7.17542 9.37518 7.17542H7.07934C6.73434 7.17542 6.45434 6.89542 6.45434 6.55042C6.45434 6.20542 6.73434 5.92542 7.07934 5.92542H9.37518Z"
                                fill="#31394F"
                            />
                        </g>
                    </svg>
                    <span className="text-[#31394f] text-[14px] leading-[16px]">
                        Client Acceptance
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            user?.role === "admin" && setIsClientAcceptanceModalOpen(true)
                        }
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
        </li>
    )
}