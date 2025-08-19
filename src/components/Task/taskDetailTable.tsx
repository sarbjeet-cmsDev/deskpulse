"use client";
import AvatarList from "@/components/IndexPage/avatarlist";
import DatePickerInput from "@/components/ProjectDetails/Datepicker";
import { useEffect, useRef, useState } from "react";
import MentionUserListModal from "@/components/MentionUserListBox";
import TaskService, { ITask } from "@/service/task.service";
import UserService from "@/service/user.service";
import { IUser } from "@/service/user.service";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CiEdit } from "react-icons/ci";
import { Input } from "../Form/Input";
import { Button } from "../Form/Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateEstimateSchema } from "../validation/userValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import formatMinutes from "@/utils/formatMinutes";
import { getSocket } from "@/utils/socket";

interface DetailsProps {
  project: {
    _id: string;
    team?: any[];
    leader?: {
      name: string;
      avatar: string;
    };
    status?: string;
    dueDate?: string;
    attachments?: string[];
    // Add more fields as needed
  };
  taskId: string;
  task: any;
  fetchTask?: any;

  onTaskUpdate: () => void;
}

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export enum PriorityEnum {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}
type EstimateInput = z.infer<typeof updateEstimateSchema>;

export default function DetailsTable({
  project,
  taskId,
  task,
  onTaskUpdate,
  fetchTask,
}: DetailsProps) {
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [kanbanList, setKanbanList] = useState([]);
  const [users, setUsers] = useState([]);
  const user: any = useSelector((state: RootState) => state.auth.user);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [editEstimate, setEditEstimate] = useState(false);
  const [assignedUser, setAssignedUser] = useState<IUser[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginUser: any = useSelector((state: RootState) => state.user.data);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const socketRef = useRef(getSocket());

  const fetchAssignedUser = async (id: string) => {
    try {
      const user = await UserService.getAssignedUser(id);
      setAssignedUser([user as IUser]);
      fetchKanbanList(task?.project);
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) { }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (task?.assigned_to) {
        fetchAssignedUser(task.assigned_to);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [task?.assigned_to]);

  const handleAssignUser = async (userId: string) => {
    try {
      await TaskService.updateTask(taskId, { assigned_to: userId });
      fetchAssignedUser(userId);
      if (onTaskUpdate) onTaskUpdate();
      handleCloseModal();

    } catch (error) {
      console.error("Failed to assign task:", error);
    }
  };

  const handleTaskDueDate = async (date: Date) => {
    try {
      await TaskService.updateTask(taskId, {
        due_date: date.toISOString(),
      });
      if (onTaskUpdate) onTaskUpdate();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update due date:", error);
    }
  };

  const fetchKanbanList = async (projectId: string) => {
    try {
      const res = await ProjectKanbon.getProjectKanbonList(projectId);
      const titles = res?.data?.map((item: any) => item.title);
      setKanbanList(titles);
    } catch (error) {
      console.log("failed to fetch kanban list", error);
    }
  };

  const mapIUserToUser = (user: IUser): User => ({
    _id: user._id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    avatar: user.profileImage || "",
  });

  const safeUsers: User[] = assignedUser
    .filter((user) => !!user.firstName && !!user.lastName)
    .map(mapIUserToUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstimateInput>({
    resolver: zodResolver(updateEstimateSchema),
    defaultValues: {
      estimated_time: task?.estimated_time,
    },
  });

  const onSubmit = async (data: any) => {
    await TaskService.updateTask(taskId, data);
    setEditEstimate(false);
    fetchTask(taskId);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setEditEstimate(false);
      }
    }
    if (editEstimate) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editEstimate]);
  return (
    <div>
      <ul className="mt-[24px]">
        <li className="">
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
                    d="M9.90566 12.0116L9.99976 12.0116L10.2102 12.0123C11.8191 12.0229 15.4957 12.1854 15.4957 14.6774C15.4957 17.153 11.9472 17.3145 10.2353 17.325L9.60107 17.325C7.99215 17.3144 4.31483 17.1521 4.31483 14.6632C4.31483 12.1845 7.99215 12.0229 9.60107 12.0123L9.81157 12.0116C9.84422 12.0116 9.87561 12.0116 9.90566 12.0116ZM9.90566 13.2616C7.92566 13.2616 5.56483 13.5049 5.56483 14.6632C5.56483 15.7954 7.78475 16.0601 9.72469 16.0751L9.90566 16.0758C11.8857 16.0758 14.2457 15.8333 14.2457 14.6774C14.2457 13.5074 11.8857 13.2616 9.90566 13.2616ZM16.5337 11.6734C18.5528 11.9759 18.977 12.9243 18.977 13.6667C18.977 14.1201 18.7987 14.9476 17.607 15.4017C17.5337 15.4292 17.4587 15.4426 17.3845 15.4426C17.1328 15.4426 16.8953 15.2892 16.8003 15.0401C16.677 14.7176 16.8395 14.3559 17.162 14.2334C17.727 14.0184 17.727 13.7809 17.727 13.6667C17.727 13.3018 17.2628 13.0468 16.3478 12.9101C16.007 12.8584 15.7712 12.5409 15.822 12.1984C15.8728 11.8568 16.1895 11.6293 16.5337 11.6734ZM3.9885 12.1984C4.03933 12.5409 3.8035 12.8584 3.46266 12.9101C2.54766 13.0468 2.0835 13.3018 2.0835 13.6667C2.0835 13.7809 2.0835 14.0176 2.64933 14.2334C2.97183 14.3559 3.13433 14.7176 3.011 15.0401C2.916 15.2892 2.6785 15.4426 2.42683 15.4426C2.35266 15.4426 2.27766 15.4292 2.20433 15.4017C1.01183 14.9467 0.833496 14.1193 0.833496 13.6667C0.833496 12.9251 1.25766 11.9759 3.27766 11.6734C3.62183 11.6301 3.93683 11.8568 3.9885 12.1984ZM9.90566 3.33325C12.0057 3.33325 13.7132 5.04158 13.7132 7.14075C13.7132 9.23992 12.0057 10.9483 9.90566 10.9483H9.88316C8.8665 10.9449 7.914 10.5466 7.20066 9.82658C6.48566 9.10742 6.09483 8.15242 6.09896 7.13825C6.09896 5.04158 7.8065 3.33325 9.90566 3.33325ZM9.90566 4.58325C8.49566 4.58325 7.34898 5.73075 7.34898 7.14075C7.3465 7.82408 7.60816 8.46325 8.08733 8.94575C8.5665 9.42825 9.20483 9.69575 9.88483 9.69825L9.90566 10.3233V9.69825C11.3157 9.69825 12.4632 8.55158 12.4632 7.14075C12.4632 5.73075 11.3157 4.58325 9.90566 4.58325ZM15.0632 4.1495C16.5282 4.39034 17.5923 5.64367 17.5923 7.1295C17.589 8.62533 16.4715 9.90867 14.9923 10.1162C14.9632 10.1203 14.934 10.122 14.9057 10.122C14.599 10.122 14.3315 9.89617 14.2873 9.58367C14.2398 9.24117 14.4773 8.92533 14.8198 8.87783C15.6865 8.75617 16.3407 8.0045 16.3423 7.12783C16.3423 6.25867 15.719 5.52367 14.8598 5.38283C14.5198 5.327 14.289 5.00533 14.3448 4.6645C14.4015 4.32367 14.7207 4.09534 15.0632 4.1495ZM5.4665 4.6645C5.52233 5.00533 5.2915 5.327 4.9515 5.38283C4.09233 5.52367 3.469 6.25867 3.469 7.1295C3.47066 8.0045 4.12483 8.757 4.99066 8.87783C5.33316 8.92533 5.57066 9.24117 5.52316 9.58367C5.479 9.89617 5.2115 10.122 4.90483 10.122C4.8765 10.122 4.84733 10.1203 4.81816 10.1162C3.339 9.90867 2.22233 8.62533 2.219 7.13117C2.219 5.64367 3.28316 4.39034 4.74816 4.1495C5.099 4.0945 5.40983 4.32534 5.4665 4.6645Z"
                    fill="#31394F"
                  />
                </g>
              </svg>
              <span className="text-[#31394f] text-[14px] leading-[16px]">
                Assignee
              </span>
            </div>
            <div className="flex items-center gap-2">
              {safeUsers.length === 0 ? (
                <div
                  className="add-member"
                  onClick={() => setIsModalOpen(true)}
                >
                  <a
                    href="#"
                    className="text-[#7980ff] border border-[#7980ff] px-[2px] rounded-[2px] text-[10px]"
                  >
                    +
                  </a>
                </div>
              ) : (
                <AvatarList
                  users={safeUsers}
                  selectedUserIds={[]}
                  onClick={handleOpenModal}
                />
              )}
            </div>
            <div className="flex items-center gap-2">

              <MentionUserListModal
                taskId={taskId}
                users={safeUsers}
                task={task}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAssigned={handleAssignUser}
              />
            </div>
          </div>
        </li>
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
                Status
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="bg-theme-primary text-white text-[12px] px-[9px] py-[4px] rounded-[8px] font-500"
              >
                {task?.status?.replace(/_/g, " ").toUpperCase()}
              </button>
              <TaskPropertyUpdateModal
                title="Update Task Status"
                options={kanbanList}
                currentValue={task?.status}
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                taskId={taskId}
                fieldName="status"
                onUpdate={onTaskUpdate}
              />
            </div>
          </div>
        </li>
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
                    d="M13.1611 0.833252C13.5061 0.833252 13.7861 1.11325 13.7861 1.45825L13.7865 2.16476C15.0032 2.24818 16.0138 2.66496 16.729 3.38167C17.5098 4.16584 17.9207 5.29334 17.9165 6.64584V14.2483C17.9165 17.025 16.1532 18.75 13.3157 18.75H6.26734C3.42984 18.75 1.6665 17.0008 1.6665 14.185V6.64417C1.6665 4.02516 3.23905 2.34404 5.80374 2.16505L5.80425 1.45825C5.80425 1.11325 6.08425 0.833252 6.42925 0.833252C6.77425 0.833252 7.05425 1.11325 7.05425 1.45825L7.054 2.14909H12.5357L12.5361 1.45825C12.5361 1.11325 12.8161 0.833252 13.1611 0.833252ZM16.6665 8.25325H2.9165V14.185C2.9165 16.3233 4.1065 17.5 6.26734 17.5H13.3157C15.4765 17.5 16.6665 16.345 16.6665 14.2483L16.6665 8.25325ZM13.5008 13.4968C13.8458 13.4968 14.1258 13.7768 14.1258 14.1218C14.1258 14.4668 13.8458 14.7468 13.5008 14.7468C13.1558 14.7468 12.8725 14.4668 12.8725 14.1218C12.8725 13.7768 13.1483 13.4968 13.4933 13.4968H13.5008ZM9.80292 13.4968C10.1479 13.4968 10.4279 13.7768 10.4279 14.1218C10.4279 14.4668 10.1479 14.7468 9.80292 14.7468C9.45792 14.7468 9.17459 14.4668 9.17459 14.1218C9.17459 13.7768 9.45042 13.4968 9.79542 13.4968H9.80292ZM6.09725 13.4968C6.44225 13.4968 6.72225 13.7768 6.72225 14.1218C6.72225 14.4668 6.44225 14.7468 6.09725 14.7468C5.75225 14.7468 5.46809 14.4668 5.46809 14.1218C5.46809 13.7768 5.74475 13.4968 6.08975 13.4968H6.09725ZM13.5008 10.2579C13.8458 10.2579 14.1258 10.5379 14.1258 10.8829C14.1258 11.2279 13.8458 11.5079 13.5008 11.5079C13.1558 11.5079 12.8725 11.2279 12.8725 10.8829C12.8725 10.5379 13.1483 10.2579 13.4933 10.2579H13.5008ZM9.80292 10.2579C10.1479 10.2579 10.4279 10.5379 10.4279 10.8829C10.4279 11.2279 10.1479 11.5079 9.80292 11.5079C9.45792 11.5079 9.17459 11.2279 9.17459 10.8829C9.17459 10.5379 9.45042 10.2579 9.79542 10.2579H9.80292ZM6.09725 10.2579C6.44225 10.2579 6.72225 10.5379 6.72225 10.8829C6.72225 11.2279 6.44225 11.5079 6.09725 11.5079C5.75225 11.5079 5.46809 11.2279 5.46809 10.8829C5.46809 10.5379 5.74475 10.2579 6.08975 10.2579H6.09725ZM12.5357 3.39909H7.054L7.05425 4.20075C7.05425 4.54575 6.77425 4.82575 6.42925 4.82575C6.08425 4.82575 5.80425 4.54575 5.80425 4.20075L5.80381 3.418C3.93695 3.57483 2.9165 4.70647 2.9165 6.64417V7.00325H16.6665L16.6665 6.64417C16.6698 5.615 16.3932 4.815 15.844 4.265C15.3619 3.78151 14.6572 3.49275 13.7868 3.4184L13.7861 4.20075C13.7861 4.54575 13.5061 4.82575 13.1611 4.82575C12.8161 4.82575 12.5361 4.54575 12.5361 4.20075L12.5357 3.39909Z"
                    fill="#31394F"
                  />
                </g>
              </svg>

              <span className="text-[#31394f] text-[14px] leading-[16px]">
                Due Date
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DatePickerInput
                onChange={(date) => {
                  if (date) {
                    handleTaskDueDate(date);
                  }
                }}
                task={task}
              />
            </div>
          </div>
        </li>
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
                    d="M13.257 1.66675C15.877 1.66675 17.637 3.46091 17.637 6.13091V13.7942C17.637 16.4876 15.9312 18.2392 13.2912 18.2559L6.88034 18.2584C4.26034 18.2584 2.49951 16.4642 2.49951 13.7942V6.13091C2.49951 3.43675 4.20535 1.68591 6.84535 1.67008L13.2562 1.66675H13.257ZM13.257 2.91675L6.84951 2.92008C4.90951 2.93175 3.74951 4.13175 3.74951 6.13091V13.7942C3.74951 15.8067 4.92035 17.0084 6.87951 17.0084L13.287 17.0059C15.227 16.9942 16.387 15.7926 16.387 13.7942V6.13091C16.387 4.11841 15.217 2.91675 13.257 2.91675ZM13.0963 12.8948C13.4413 12.8948 13.7213 13.1748 13.7213 13.5198C13.7213 13.8648 13.4413 14.1448 13.0963 14.1448H7.0796C6.73459 14.1448 6.45459 13.8648 6.45459 13.5198C6.45459 13.1748 6.73459 12.8948 7.0796 12.8948H13.0963ZM13.0963 9.40608C13.4413 9.40608 13.7213 9.68608 13.7213 10.0311C13.7213 10.3761 13.4413 10.6561 13.0963 10.6561H7.0796C6.73459 10.6561 6.45459 10.3761 6.45459 10.0311C6.45459 9.68608 6.73459 9.40608 7.0796 9.40608H13.0963ZM9.37518 5.92542C9.72018 5.92542 10.0002 6.20542 10.0002 6.55042C10.0002 6.89542 9.72018 7.17542 9.37518 7.17542H7.07934C6.73434 7.17542 6.45434 6.89542 6.45434 6.55042C6.45434 6.20542 6.73434 5.92542 7.07934 5.92542H9.37518Z"
                    fill="#31394F"
                  />
                </g>
              </svg>
              <span className="text-[#31394f] text-[14px] leading-[16px]">
                Total Time Spent
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="py-[2px] px-[8px] rounded-[8px] text-[15px] leading-[16px]">
                {formatMinutes(task?.totaltaskminutes)}
              </div>
            </div>
          </div>
        </li>
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
                Priority
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  user?.role === "admin" && setIsPriorityModalOpen(true)
                }
                className="bg-theme-primary text-white text-[12px] px-[9px] py-[4px] rounded-[8px] font-500"
              >
                {task?.priority?.toUpperCase()}
              </button>
              <TaskPropertyUpdateModal
                title="Update Task Priority"
                options={Object.values(PriorityEnum)}
                currentValue={task?.priority}
                isOpen={isPriorityModalOpen}
                onClose={() => setIsPriorityModalOpen(false)}
                taskId={taskId}
                fieldName="priority"
                onUpdate={onTaskUpdate}
              />
            </div>
          </div>
        </li>

        <li className="mt-[13px]">
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
                Estimated Time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="py-[2px] px-[8px]  rounded-[8px] text-[15px] leading-[16px] flex gap-4"
                ref={dropdownRef}
              >
                {editEstimate ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-2">
                      <Input
                        {...register("estimated_time")}
                        type="text"
                        className="w-[100px] cursor-pointer"
                        defaultValue={task?.estimated_time}
                      />
                      <Button
                        type="submit"
                        className="bg-theme-primary text-white"
                      >
                        Update
                      </Button>
                    </div>

                    {errors.estimated_time && (
                      <p className="text-xs text-red-500 mt-2 ml-1">
                        {errors.estimated_time.message}
                      </p>
                    )}
                  </form>
                ) : (
                  <div>{formatMinutes(Number(task?.estimated_time) * 60)}</div>
                )}
                {!editEstimate && user?.role === "admin" && (
                  <CiEdit
                    size={20}
                    className="cursor-pointer"
                    onClick={() => setEditEstimate(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
