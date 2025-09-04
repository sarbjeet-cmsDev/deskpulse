"use client";
import AvatarList from "@/components/IndexPage/avatarlist";
import DatePickerInput from "@/components/ProjectDetails/Datepicker";
import { useEffect, useState } from "react";
import MentionUserListModal from "@/components/MentionUserListBox";
import TaskService from "@/service/task.service";
import UserService from "@/service/user.service";
import { IUser } from "@/service/user.service";
import { ProjectKanbon } from "@/service/projectKanbon.service";
import TaskPropertyUpdateModal from "./TaskStatusUpdateModal";
import formatMinutes from "@/utils/formatMinutes";
import { isDarkColor } from "@/utils/IsDarkColor";
import { EstimateTime } from "./estimateTime";
import { ClientAcceptance } from "./clientAcceptance";
import { UpdateType } from "./updateType";
import { UpdatePriority } from "./updatePriority";
import { AssigneeIcon, CalenderIcon, CopyIcon, StatusIcon } from "../icons";

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
export default function DetailsTable({
  project,
  taskId,
  task,
  onTaskUpdate,
  fetchTask,
}: DetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [kanbanList, setKanbanList] = useState([]);
  const [assignedUser, setAssignedUser] = useState<IUser[]>([]);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
      const titles = res?.data?.map((item: any) => item);
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

  const activeColor: any = kanbanList?.find(
    (item: any) => item?.title === task?.status
  );
  const style = activeColor?.color
    ? {
      backgroundColor: activeColor.color ? activeColor.color : "#7980ff",
      color: isDarkColor(activeColor.color) ? "white" : "black",
    }
    : {
      backgroundColor: activeColor?.color ? activeColor?.color : "#7980ff",
    };

  return (
    <div>
      <ul className="mt-[24px]">
        <li className="">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-4 w-[35%]">
              <AssigneeIcon />
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
              <StatusIcon />
              <span className="text-[#31394f] text-[14px] leading-[16px]">
                Status
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className={` text-white text-[12px] px-[9px] py-[4px] rounded-[8px] font-500`}
                style={style}
              >
                {task?.status?.replace(/_/g, " ").toUpperCase()}
              </button>
              <TaskPropertyUpdateModal
                title="Update Task Status"
                options={kanbanList}
                currentValue={task?.status}
                currentColor={task?.color}
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
              <CalenderIcon />
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
              <CopyIcon />
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
        <UpdatePriority task={task} taskId={taskId} onTaskUpdate={onTaskUpdate} />
        <UpdateType task={task} taskId={taskId} onTaskUpdate={onTaskUpdate} />
        <EstimateTime task={task} taskId={taskId} fetchTask={fetchTask} />
        <ClientAcceptance
          task={task}
          taskId={taskId}
          onTaskUpdate={onTaskUpdate}
        />
      </ul>
    </div>
  );
}